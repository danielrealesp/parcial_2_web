export interface CountryApiData {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
}

export interface ICountriesApiProvider {
  /**
   * Fetch country information by alpha-3 code from external API
   * @param code - The alpha-3 country code (e.g., 'COL', 'FRA')
   * @returns Country data or null if not found
   */
  getCountryByCode(code: string): Promise<CountryApiData | null>;
}

export const COUNTRIES_API_PROVIDER = 'COUNTRIES_API_PROVIDER';
