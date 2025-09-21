import { Role } from '@prisma/client';
import express from 'express';
export interface TCreateUser {
  username: string;
  email: string;
  password: string;
  role: Role;
}
export interface TUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TGetUser {
  id: string;
  username: string;
  email: string;
}
export interface TDeleteUser {
  success: boolean;
  message: string;
  email: string;
}
export interface TUpdateUser {
  email: string;
  username?: string;
  passwowrd?: string;
  success: boolean;
  message: string;
}

export interface TResponse {
  success: Boolean;
  message: string;
}
export interface TContext {
  req: express.Request;
  res: express.Response;
}
