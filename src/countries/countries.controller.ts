import { Controller, Get, Delete, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryCodeParamDto } from './dto/country-code-param.dto';
import { CountryResponseDto, CountryWithSourceDto } from './dto/country-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

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

  @Delete(':code')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByCode(@Param() params: CountryCodeParamDto): Promise<void> {
    return this.countriesService.deleteByCode(params.code);
  }
}
