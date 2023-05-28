import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleUserPropertyService } from './schedule-user-property.service';

describe('ScheduleUserPropertyService', () => {
  let service: ScheduleUserPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleUserPropertyService],
    }).compile();

    service = module.get<ScheduleUserPropertyService>(ScheduleUserPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
