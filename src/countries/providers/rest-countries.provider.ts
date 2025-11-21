import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ICountriesApiProvider, CountryApiData } from './countries-api-provider.interface';

@Injectable()
export class RestCountriesProvider implements ICountriesApiProvider {
  private readonly logger = new Logger(RestCountriesProvider.name);
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'REST_COUNTRIES_API_URL',
      'https://restcountries.com/v3.1',
    );

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getCountryByCode(code: string): Promise<CountryApiData | null> {
    try {
      this.logger.log(`Fetching country data for code: ${code} from RestCountries API`);

      const response = await this.httpClient.get(`/alpha/${code.toUpperCase()}`, {
        params: {
          fields: 'cca3,name,region,subregion,capital,population,flags',
        },
      });

      // When using the fields parameter, RestCountries API returns a single object
      // Without fields parameter, it returns an array
      const countryData = response.data;

      if (!countryData) {
        this.logger.warn(`Country not found for code: ${code}`);
        return null;
      }

      // Map the API response to our CountryApiData interface
      return {
        code: countryData.cca3,
        name: countryData.name.common,
        region: countryData.region,
        subregion: countryData.subregion || 'N/A',
        capital: countryData.capital?.[0] || 'N/A',
        population: countryData.population,
        flagUrl: countryData.flags.png || countryData.flags.svg,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          this.logger.warn(`Country not found for code: ${code}`);
          return null;
        }
        this.logger.error(`Error fetching country from API: ${error.message}`);
      } else {
        this.logger.error(`Unexpected error: ${error}`);
      }
      throw error;
    }
  }
}
