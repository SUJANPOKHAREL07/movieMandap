export interface TCreateUser {
  username: string;
  email: string;
  password: string;
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
