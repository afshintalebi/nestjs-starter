import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { AfterAdminSignInEvent } from '../impl/after-admin-signin.event';
import { AuthCommonService } from '../../services/auth-common.service';

@EventsHandler(AfterAdminSignInEvent)
export class AfterAdminSignInEventHandler
  implements IEventHandler<AfterAdminSignInEvent>
{
  constructor(private readonly commonService: AuthCommonService) {}

  handle(event: AfterAdminSignInEvent) {
    const { userId, refreshToken } = event;

    return this.commonService.updateRefreshToken(userId, refreshToken, true);
  }
}
