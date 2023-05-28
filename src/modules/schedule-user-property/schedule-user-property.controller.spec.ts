import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleUserPropertyController } from './schedule-user-property.controller';
import { ScheduleUserPropertyService } from './schedule-user-property.service';

describe('ScheduleUserPropertyController', () => {
  let controller: ScheduleUserPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleUserPropertyController],
      providers: [ScheduleUserPropertyService],
    }).compile();

    controller = module.get<ScheduleUserPropertyController>(ScheduleUserPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
