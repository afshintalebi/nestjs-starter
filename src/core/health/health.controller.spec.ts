import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getHealthModuleTestConfigs } from '../../../test/inc/test-utils';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckService;
  let mongoose: MongooseHealthIndicator;
  let memory: MemoryHealthIndicator;
  let disk: DiskHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      getHealthModuleTestConfigs(),
    ).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthCheckService>(HealthCheckService);
    mongoose = await module.resolve<MongooseHealthIndicator>(
      MongooseHealthIndicator,
    );
    memory = await module.resolve<MemoryHealthIndicator>(MemoryHealthIndicator);
    disk = await module.resolve<DiskHealthIndicator>(DiskHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkDB method', () => {
    it('should be defined', async () => {
      expect(controller.checkDB).toBeDefined();
    });

    it('should check DB connection', async () => {
      const mockFn = jest.spyOn(service, 'check').mockImplementation();
      const mockFn2 = jest.spyOn(mongoose, 'pingCheck').mockImplementation();

      await controller.checkDB();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });
  });

  describe('checkMemory method', () => {
    it('should be defined', async () => {
      expect(controller.checkMemory).toBeDefined();
    });

    it('should check memory', async () => {
      const mockFn = jest.spyOn(service, 'check').mockImplementation();
      const mockFn2 = jest.spyOn(memory, 'checkHeap').mockImplementation();
      const mockFn3 = jest.spyOn(memory, 'checkRSS').mockImplementation();

      await controller.checkMemory();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();
    });
  });

  describe('checkDisk method', () => {
    it('should be defined', async () => {
      expect(controller.checkDisk).toBeDefined();
    });

    it('should check disk', async () => {
      const mockFn = jest.spyOn(service, 'check').mockImplementation();
      const mockFn2 = jest.spyOn(disk, 'checkStorage').mockImplementation();

      await controller.checkDisk();

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
    });
  });
});
