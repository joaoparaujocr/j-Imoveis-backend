import { Injectable } from '@nestjs/common';
import { CreateScheduleUserPropertyDto } from './dto/create-schedule-user-property.dto';
import { UpdateScheduleUserPropertyDto } from './dto/update-schedule-user-property.dto';

@Injectable()
export class ScheduleUserPropertyService {
  create(createScheduleUserPropertyDto: CreateScheduleUserPropertyDto) {
    return 'This action adds a new scheduleUserProperty';
  }

  findAll() {
    return `This action returns all scheduleUserProperty`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleUserProperty`;
  }

  update(id: number, updateScheduleUserPropertyDto: UpdateScheduleUserPropertyDto) {
    return `This action updates a #${id} scheduleUserProperty`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleUserProperty`;
  }
}
