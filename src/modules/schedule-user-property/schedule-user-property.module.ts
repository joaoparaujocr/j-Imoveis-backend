import { Module } from '@nestjs/common';
import { ScheduleUserPropertyService } from './schedule-user-property.service';
import { ScheduleUserPropertyController } from './schedule-user-property.controller';

@Module({
  controllers: [ScheduleUserPropertyController],
  providers: [ScheduleUserPropertyService]
})
export class ScheduleUserPropertyModule {}
