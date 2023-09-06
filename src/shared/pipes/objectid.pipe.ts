import { UtilsService } from '@/common/utils/utils.service';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  constructor(private readonly utilsService: UtilsService) {}

  transform(value: string, { type, data }: ArgumentMetadata) {
    if (type === 'param') {
      if (!this.utilsService.isValidObjectId(value)) {
        throw new BadRequestException(`Value of ${data} isn't ObjectID`);
      }
    }

    return value;
  }
}
