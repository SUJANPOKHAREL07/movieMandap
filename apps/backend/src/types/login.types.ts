import { Role } from '@prisma/client';

export interface TLogin {
  email: string;
  password: string;
}
export interface TLoad {
  username: string;
  role: Role;
}
