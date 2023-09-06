export class AfterAdminSignInEvent {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
  ) {}
}
