import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import * as RequestIp from 'request-ip';
import { RequestInterface } from '../types/request.interface';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(request: RequestInterface, reply: FastifyReply, done: () => void) {
    request.clientIP = RequestIp.getClientIp(request);
    done();
  }
}
