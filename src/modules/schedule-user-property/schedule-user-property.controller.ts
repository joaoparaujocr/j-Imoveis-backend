import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleUserPropertyService } from './schedule-user-property.service';
import { CreateScheduleUserPropertyDto } from './dto/create-schedule-user-property.dto';
import { UpdateScheduleUserPropertyDto } from './dto/update-schedule-user-property.dto';

@Controller('schedule-user-property')
export class ScheduleUserPropertyController {
  constructor(private readonly scheduleUserPropertyService: ScheduleUserPropertyService) {}

  @Post()
  create(@Body() createScheduleUserPropertyDto: CreateScheduleUserPropertyDto) {
    return this.scheduleUserPropertyService.create(createScheduleUserPropertyDto);
  }

  @Get()
  findAll() {
    return this.scheduleUserPropertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleUserPropertyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleUserPropertyDto: UpdateScheduleUserPropertyDto) {
    return this.scheduleUserPropertyService.update(+id, updateScheduleUserPropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleUserPropertyService.remove(+id);
  }
}
