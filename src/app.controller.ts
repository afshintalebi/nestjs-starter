import { Controller, Get } from '@nestjs/common';

@Controller({
  version: '1',
})
export class AppController {
  @Get()
  getVersion(): string {
    return 'API version 1';
  }
}
