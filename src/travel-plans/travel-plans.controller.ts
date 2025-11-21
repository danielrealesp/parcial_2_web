import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';
import { TravelPlanIdParamDto } from './dto/travel-plan-id-param.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  async create(@Body() createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.create(createTravelPlanDto);
  }

  @Get()
  async findAll(): Promise<TravelPlanResponseDto[]> {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: TravelPlanIdParamDto): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.findById(params.id);
  }
}
