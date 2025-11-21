import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryCodeParamDto } from './dto/country-code-param.dto';
import { CountryResponseDto, CountryWithSourceDto } from './dto/country-response.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.findAll();
  }

  @Get(':code')
  async findByCode(@Param() params: CountryCodeParamDto): Promise<CountryWithSourceDto> {
    return this.countriesService.findByCode(params.code);
  }
}
