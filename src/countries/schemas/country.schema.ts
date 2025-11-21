import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true, unique: true, uppercase: true, length: 3 })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  subregion: string;

  @Prop({ required: true })
  capital: string;

  @Prop({ required: true })
  population: number;

  @Prop({ required: true })
  flagUrl: string;

  // Timestamps are automatically managed by Mongoose with { timestamps: true }
  createdAt?: Date;
  updatedAt?: Date;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
