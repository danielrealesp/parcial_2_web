import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CountryResponseDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  region: string;

  @IsString()
  subregion: string;

  @IsString()
  capital: string;

  @IsNumber()
  population: number;

  @IsString()
  flagUrl: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

export type DataSource = 'cache' | 'external_api';

export class CountryWithSourceDto {
  data: CountryResponseDto;
  source: DataSource;
}
