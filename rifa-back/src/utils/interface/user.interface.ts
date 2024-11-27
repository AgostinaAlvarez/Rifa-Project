import { Role } from '../enums/role.enum';

export type UserInterface = {
  _id: string;

  email: string;

  roles: Role[];

  planId?: string;
};
