export class AfterSignInEvent {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
  ) {}
}
