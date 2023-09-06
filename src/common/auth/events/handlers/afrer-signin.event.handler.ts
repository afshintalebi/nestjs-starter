import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { AfterSignInEvent } from '../impl/after-signin.event';
import { AuthCommonService } from '../../services/auth-common.service';

@EventsHandler(AfterSignInEvent)
export class AfterSignInEventHandler
  implements IEventHandler<AfterSignInEvent>
{
  constructor(private readonly authCommonService: AuthCommonService) {}

  handle(event: AfterSignInEvent) {
    const { userId, refreshToken } = event;

    return this.authCommonService.updateRefreshToken(userId, refreshToken);
  }
}
