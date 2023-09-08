import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { UtilsService } from './utils.service';
import generalConfig from '@/shared/configs/app.config';
import envValidationSchema from '@/shared/configs/env.validation.schema';
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
