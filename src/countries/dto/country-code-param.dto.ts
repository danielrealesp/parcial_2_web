import { IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CountryCodeParamDto {
  @IsString()
  @Length(3, 3, { message: 'Country code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/i, { message: 'Country code must contain only letters' })
  @Transform(({ value }) => value.toUpperCase())
  code: string;
}
