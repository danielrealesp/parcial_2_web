import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { TravelPlan, TravelPlanDocument } from './schemas/travel-plan.schema';
import { CountriesService } from '../countries/countries.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';

@Injectable()
export class TravelPlansService {
  private readonly logger = new Logger(TravelPlansService.name);

  constructor(
    @InjectModel(TravelPlan.name) private readonly travelPlanModel: Model<TravelPlanDocument>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlanResponseDto> {
    this.logger.log(`Creating travel plan: ${createTravelPlanDto.title}`);

    // Ensure the country exists and get its ObjectId
    const countryId = await this.countriesService.ensureCountryExistsAndGetId(
      createTravelPlanDto.countryCode,
    );

    // Create the travel plan
    const travelPlan = new this.travelPlanModel({
      country: countryId,
      title: createTravelPlanDto.title,
      startDate: new Date(createTravelPlanDto.startDate),
      endDate: new Date(createTravelPlanDto.endDate),
      notes: createTravelPlanDto.notes || [],
    });

    await travelPlan.save();
    this.logger.log(`Travel plan created with ID: ${travelPlan._id}`);

    // Fetch the created plan with populated country data
    return this.findById(travelPlan._id.toString());
  }

  async findAll(): Promise<TravelPlanResponseDto[]> {
    this.logger.log('Fetching all travel plans');
    const travelPlans = await this.travelPlanModel
      .find()
      .populate('country')
      .lean()
      .exec();

    return plainToInstance(TravelPlanResponseDto, travelPlans);
  }

  async findById(id: string): Promise<TravelPlanResponseDto> {
    this.logger.log(`Fetching travel plan with ID: ${id}`);
    const travelPlan = await this.travelPlanModel
      .findById(id)
      .populate('country')
      .lean()
      .exec();

    if (!travelPlan) {
      throw new NotFoundException(`Travel plan with ID ${id} not found`);
    }

    return plainToInstance(TravelPlanResponseDto, travelPlan);
  }
}
