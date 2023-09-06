import { GeneralObject } from '@/shared/types/general-object';

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly data: GeneralObject,
  ) {}
}
