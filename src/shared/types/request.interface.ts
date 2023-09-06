import { FastifyRequest } from 'fastify';
import mongodb from 'mongodb';
import { UserEntity } from '../entities/user.entity';

type ExtendedRawRequet = FastifyRequest['raw'] & {
  clientIP: string;

  language: string;
};
/**
 * Extends request interface to append app-layer properties to request
 */
export interface RequestInterface extends FastifyRequest {
  clientIP: string;

  language: string;

  raw: ExtendedRawRequet;

  user: UserEntity;

  traceId: mongodb.ObjectId;
}
