import { SignUpDto } from '@/shared/dto/signup.dto';

export type AdminUserData = SignUpDto & { isAdmin?: boolean };
