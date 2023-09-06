export interface JwtPayloadInterface {
  email: string;
  name: string;
  iat?: string;
  exp?: string | number;
  sub?: any;
}
