import { AdminUserData } from '../../types/create-admin-data';

export class CreateAdminCommand {
  constructor(public readonly data: AdminUserData) {}
}
