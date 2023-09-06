export class AfterResetPasswordEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly code: string,
  ) {}
}
