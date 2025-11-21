import { IsString, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { CountryResponseDto } from '../../countries/dto/country-response.dto';

export class TravelPlanResponseDto {
  @Transform(({ obj }) => obj._id?.toString())
  @IsString()
  id: string;

  country: CountryResponseDto;

  @IsString()
  title: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsArray()
  @IsString({ each: true })
  notes: string[];

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
