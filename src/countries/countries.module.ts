import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country, CountrySchema } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/rest-countries.provider';
import { COUNTRIES_API_PROVIDER } from './providers/countries-api-provider.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: COUNTRIES_API_PROVIDER,
      useClass: RestCountriesProvider,
    },
  ],
  exports: [CountriesService],
})
export class CountriesModule {}
