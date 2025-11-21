# API Backend - Planes de Viaje

Aplicación NestJS para gestión de países y planes de viaje con MongoDB.
(Entrega Preparcial)

## Descripción

Esta API permite:
- **Módulo Countries**: Gestionar información de países con caché local. Consulta países desde RestCountries API y los almacena en MongoDB para consultas posteriores.
- **Módulo TravelPlans**: Crear y gestionar planes de viaje asociados a países específicos. Cada plan incluye fechas, título y notas opcionales.

## Arquitectura

Clean Architecture con:
- **Controllers**: Endpoints HTTP con decoradores NestJS
- **Services**: Lógica de negocio y validación
- **Providers**: Abstracción para APIs externas (RestCountries)
- **DTOs**: Validación con class-validator
- **Schemas**: Modelos Mongoose para MongoDB

## Requisitos

- Node.js 20+
- Docker y Docker Compose

## Inicio Rápido

### Con Docker Compose (Recomendado)

```bash
docker-compose up --build
```

La API estará disponible en `http://localhost:8080`

### Desarrollo Local

```bash
npm install
npm run start:dev
```

Asegúrate de tener MongoDB corriendo localmente y actualiza el `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/parcial2
```

## Endpoints

### Países

**Listar todos los países**
```http
GET /countries
```

**Obtener país por código**
```http
GET /countries/:code
```
- Parámetro: `code` (alpha-3, ej: "COL", "FRA")
- Retorna metadata `source`: `"cache"` o `"external_api"`
- Si no existe en BD, se obtiene de RestCountries y se guarda

**Ejemplo de respuesta:**
```json
{
  "data": {
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "capital": "Bogotá",
    "population": 50882884,
    "flagUrl": "https://flagcdn.com/w320/co.png",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  },
  "source": "cache"
}
```

### Planes de Viaje

**Crear plan de viaje**
```http
POST /travel-plans
```

**Body:**
```json
{
  "countryCode": "COL",
  "title": "Vacaciones de Verano",
  "startDate": "2024-07-01",
  "endDate": "2024-07-15",
  "notes": ["Visitar Cartagena", "Probar comida local"]
}
```

**Validaciones:**
- `countryCode`: Requerido, 3 letras
- `title`: Requerido
- `startDate`: Requerido, formato ISO 8601
- `endDate`: Requerido, debe ser posterior a startDate
- `notes`: Opcional, array de strings

**Listar planes de viaje**
```http
GET /travel-plans
```

**Obtener plan por ID**
```http
GET /travel-plans/:id
```
- Parámetro: `id` (MongoDB ObjectId)

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto de la aplicación | `8080` |
| `MONGODB_URI` | Conexión MongoDB | `mongodb://mongodb:27017/parcial2` |
| `REST_COUNTRIES_API_URL` | URL API RestCountries | `https://restcountries.com/v3.1` |

## Scripts de Desarrollo

```bash
npm run start:dev    # Desarrollo con hot reload
npm run build        # Compilar
npm run start:prod   # Producción
```

## Comandos Docker

```bash
docker-compose up --build    # Iniciar y construir
docker-compose down          # Detener
docker-compose logs -f       # Ver logs
docker-compose down -v       # Detener y eliminar BD
```

## Provider Externo - RestCountries

El sistema utiliza un patrón de provider para abstraer la consulta de países:

1. **Interfaz `ICountriesApiProvider`**: Define el contrato que cualquier proveedor de información de países debe cumplir.
2. **Implementación `RestCountriesProvider`**: Consume la API de RestCountries (https://restcountries.com/v3.1).
3. **Inyección de Dependencias**: El servicio de países recibe el provider vía DI, permitiendo cambiar la implementación sin modificar la lógica de negocio.

**Flujo de consulta:**
- Cuando se solicita un país por código, primero se busca en la BD local (caché)
- Si no existe, se consulta RestCountries API con los campos: `cca3`, `name`, `region`, `subregion`, `capital`, `population`, `flags`
- Los datos se mapean a nuestro modelo y se guardan en MongoDB
- Futuras consultas retornan desde caché

## Modelo de Datos

### Country (País)
```typescript
{
  code: string,          // Código alpha-3 (COL, FRA, etc.)
  name: string,          // Nombre del país
  region: string,        // Región (Americas, Europe, etc.)
  subregion: string,     // Subregión (South America, etc.)
  capital: string,       // Capital del país
  population: number,    // Población
  flagUrl: string,       // URL de la bandera
  createdAt: Date,       // Fecha de creación en BD
  updatedAt: Date        // Fecha de última actualización
}
```

### TravelPlan (Plan de Viaje)
```typescript
{
  _id: ObjectId,              // ID único del plan
  country: ObjectId,          // Referencia al país (Mongoose ref)
  title: string,              // Título del viaje
  startDate: Date,            // Fecha de inicio
  endDate: Date,              // Fecha de fin
  notes: string[],            // Notas/comentarios (array)
  createdAt: Date,            // Fecha de creación
  updatedAt: Date             // Fecha de última actualización
}
```

## Pruebas Básicas Sugeridas

### 1. Consultar país no cacheado
```bash
# Primera consulta - se obtiene de RestCountries API
curl http://localhost:8080/countries/COL
# Response incluirá: "source": "external_api"
```

### 2. Consultar país cacheado
```bash
# Segunda consulta del mismo país - se obtiene de MongoDB
curl http://localhost:8080/countries/COL
# Response incluirá: "source": "cache"
```

### 3. Crear plan de viaje
```bash
curl -X POST http://localhost:8080/travel-plans \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "COL",
    "title": "Vacaciones Colombia",
    "startDate": "2024-07-01",
    "endDate": "2024-07-15",
    "notes": ["Visitar Cartagena"]
  }'
```

### 4. Listar todos los planes
```bash
curl http://localhost:8080/travel-plans
```

### 5. Validación de fechas
```bash
# Intentar crear plan con endDate antes de startDate (debe fallar)
curl -X POST http://localhost:8080/travel-plans \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "FRA",
    "title": "Test",
    "startDate": "2024-07-15",
    "endDate": "2024-07-01"
  }'
# Response: Error de validación
```
