import { Test, TestingModule } from '@nestjs/testing';
import { AlertTypesController } from './alert-types.controller';
import { AlertTypesService } from './alert-types.service';

describe('AlertTypesController', () => {
  let controller: AlertTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertTypesController],
      providers: [AlertTypesService],
    }).compile();

    controller = module.get<AlertTypesController>(AlertTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
