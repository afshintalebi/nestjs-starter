import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { AfterResetPasswordEvent } from '../impl/after-reset-password.event';
import { Logger } from '@nestjs/common';

@EventsHandler(AfterResetPasswordEvent)
export class AfterResetPasswordHandler
  implements IEventHandler<AfterResetPasswordEvent>
{
  handle(event: AfterResetPasswordEvent) {
    const { userId, email, code } = event;

    Logger.debug(
      `After reset password has been teriggered, data: ${userId}, ${email}, ${code}`,
    );
  }
}
