import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller({
  version: '',
  path: 'health',
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get('db')
  @HealthCheck()
  checkDB() {
    return this.health.check([async () => this.mongoose.pingCheck('mongoose')]);
  }

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
    ]);
  }

  @Get('disk')
  @HealthCheck()
  check() {
    return this.health.check([
      // The used disk storage should not exceed 90% of the full disk size
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.9,
          path: '/',
        }),
      // The used disk storage should not exceed 250 GB
      () =>
        this.disk.checkStorage('disk health', {
          threshold: 250 * 1024 * 1024 * 1024,
          path: '/',
        }),
    ]);
  }
}
