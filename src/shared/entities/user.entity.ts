export class UserEntity {
  id: string;
  email: string;
  name: string;
  token?: string;
  refreshToken?: string;
  isAdmin?: boolean;
}
