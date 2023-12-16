import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { getDefaultImportsOfAppModule } from '@/../test/test-utils';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...getDefaultImportsOfAppModule()],
      providers: [UtilsService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
