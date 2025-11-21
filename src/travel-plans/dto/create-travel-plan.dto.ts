import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, Length, Matches, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Transform } from 'class-transformer';

@ValidatorConstraint({ name: 'IsEndDateAfterStartDate', async: false })
class IsEndDateAfterStartDateConstraint implements ValidatorConstraintInterface {
  validate(endDate: any, args: ValidationArguments) {
    const object = args.object as any;
    const startDate = new Date(object.startDate);
    const end = new Date(endDate);
    return end > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End date must be after start date';
  }
}

export class CreateTravelPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Country code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/i, { message: 'Country code must contain only letters' })
  @Transform(({ value }) => value.toUpperCase())
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @Validate(IsEndDateAfterStartDateConstraint)
  endDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notes?: string[];
}
