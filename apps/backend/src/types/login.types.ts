import { Role } from '@prisma/client';

export interface TLogin {
  username: string;
  email: string;
  password: string;
}
export interface TLoad {
  userId: number;
  role: Role;
}
