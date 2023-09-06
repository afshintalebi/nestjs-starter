import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponse {
  @ApiProperty()
  result: boolean;
}
