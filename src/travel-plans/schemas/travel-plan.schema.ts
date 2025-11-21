import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Country } from '../../countries/schemas/country.schema';

export type TravelPlanDocument = HydratedDocument<TravelPlan>;

@Schema({ timestamps: true })
export class TravelPlan {
  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  country: Types.ObjectId | Country;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ type: [String], default: [] })
  notes: string[];

  // Timestamps are automatically managed by Mongoose with { timestamps: true }
  createdAt?: Date;
  updatedAt?: Date;
}

export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);
