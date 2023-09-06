import { AfterAdminSignInEventHandler } from './afrer-admin-signin.event.handler';
import { AfterResetPasswordHandler } from './afrer-reset-password.event.handler';
import { AfterSignInEventHandler } from './afrer-signin.event.handler';

export const EventHandlers = [
  AfterSignInEventHandler,
  AfterResetPasswordHandler,
  AfterAdminSignInEventHandler,
];
