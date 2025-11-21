import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Country, CountryDocument } from './schemas/country.schema';
import {
  ICountriesApiProvider,
  COUNTRIES_API_PROVIDER,
} from './providers/countries-api-provider.interface';
import { CountryResponseDto, CountryWithSourceDto } from './dto/country-response.dto';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    @InjectModel(Country.name) private readonly countryModel: Model<CountryDocument>,
    @Inject(COUNTRIES_API_PROVIDER) private readonly countriesApiProvider: ICountriesApiProvider,
  ) {}

  async findAll(): Promise<CountryResponseDto[]> {
    this.logger.log('Fetching all countries from database');
    const countries = await this.countryModel.find().lean().exec();
    return plainToInstance(CountryResponseDto, countries);
  }

  async findByCode(code: string): Promise<CountryWithSourceDto> {
    this.logger.log(`Looking for country with code: ${code}`);

    // First, try to find in database (cache)
    let country = await this.countryModel.findOne({ code }).lean().exec();

    if (country) {
      this.logger.log(`Country ${code} found in cache`);
      return {
        data: plainToInstance(CountryResponseDto, country),
        source: 'cache',
      };
    }

    // Not in cache, fetch from external API
    this.logger.log(`Country ${code} not in cache, fetching from external API`);
    const apiData = await this.countriesApiProvider.getCountryByCode(code);

    if (!apiData) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }

    // Save to database
    const newCountry = new this.countryModel(apiData);
    await newCountry.save();
    this.logger.log(`Country ${code} saved to cache`);

    // Fetch the saved document as plain object
    country = await this.countryModel.findOne({ code }).lean().exec();

    return {
      data: plainToInstance(CountryResponseDto, country),
      source: 'external_api',
    };
  }

  /**
   * Ensures a country exists in the database and returns its ObjectId
   * If the country doesn't exist, it will be fetched from the external API and saved
   * @param code - The alpha-3 country code
   * @returns The MongoDB ObjectId of the country
   */
  async ensureCountryExistsAndGetId(code: string): Promise<Types.ObjectId> {
    // Call findByCode to ensure the country exists (will fetch from API if needed)
    await this.findByCode(code);

    // Now get the country document with its ObjectId
    const country = await this.countryModel.findOne({ code }).exec();

    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }

    return country._id;
  }
}
