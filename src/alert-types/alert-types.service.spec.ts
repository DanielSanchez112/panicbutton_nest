import { Test, TestingModule } from '@nestjs/testing';
import { AlertTypesService } from './alert-types.service';

describe('AlertTypesService', () => {
  let service: AlertTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertTypesService],
    }).compile();

    service = module.get<AlertTypesService>(AlertTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
