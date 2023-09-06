import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RequestInterface } from '../types/request.interface';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(request: RequestInterface, res: FastifyReply['raw'], done: () => void) {
    const language = request.headers['accept-language'];

    if (!language) {
      throw new BadRequestException('accept-language in header is required');
    }

    request.language = language;

    done();
  }
}
