import { DEVELOPMENT_ENV, STAGING_ENV } from '@/shared/configs/constants';
import { GeneralResponse } from '@/shared/entities/general-response';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class ResetPasswordEntity extends IntersectionType(GeneralResponse) {
  @ApiProperty({
    description: `has value just in the ${DEVELOPMENT_ENV} and ${STAGING_ENV} environment`,
  })
  code?: string;
}
