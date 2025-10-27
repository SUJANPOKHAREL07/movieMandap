import { Role } from '@prisma/client';
import prisma from '../prisma/client';

export const loginModal = {
  checkLoginCred,
  loginUser,
  alreadyLoggedIn,
  getLoginInfo,
};

async function checkLoginCred(data: { email?: string; username?: string }) {
  const log = await prisma.user.findUnique({
    where: {
      email: data.email,
      username: data.username,
    },
    select: {
      username: true,
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });
  return log;
}
async function loginUser(data: {
  userId: number;
  em: string;
  password: string;
  refresh_token: string;
  role: Role;
}) {
  console.log('login data :', data);
  const dataLogin = await prisma.login.create({
    data: {
      useremail: data.em,
      userId: data.userId,
      password: data.password,
      refresh_token: data.refresh_token,
      role: data.role,
    },
  });
  console.log('data stored in the table :', dataLogin);
  return dataLogin;
}
async function alreadyLoggedIn(token: string) {
  const data = await prisma.login.findFirst({
    where: {
      refresh_token: token,
    },
  });
  return data;
}
async function getLoginInfo(token: string) {
  const get = await prisma.login.findMany({
    where: {
      refresh_token: token,
    },
  });
  return get;
}
export const LogoutModal = { logout, checkToken };
async function checkToken(token: string) {
  const data = await prisma.login.findFirst({
    where: {
      refresh_token: token,
    },
  });
  return data;
}
async function logout(id: number) {
  const user = await prisma.login.deleteMany({
    where: {
      id: id,
    },
  });
  return user;
}
