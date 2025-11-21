import { IsMongoId } from 'class-validator';

export class TravelPlanIdParamDto {
  @IsMongoId({ message: 'Invalid travel plan ID format' })
  id: string;
}
