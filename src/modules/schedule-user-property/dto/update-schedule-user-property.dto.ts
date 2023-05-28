import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleUserPropertyDto } from './create-schedule-user-property.dto';

export class UpdateScheduleUserPropertyDto extends PartialType(CreateScheduleUserPropertyDto) {}
