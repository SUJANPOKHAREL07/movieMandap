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
  userId: string;
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
async function alreadyLoggedIn(email: string) {
  const data = await prisma.login.findFirst({
    where: {
      useremail: email,
    },
  });
  return data;
}
async function getLoginInfo(token: string) {
  const get = await prisma.login.findUnique({
    where: {
      refresh_token: token,
    },
  });
  return get;
}
export const LogoutModal = { logout };

async function logout(token: string) {
  const user = await prisma.login.delete({
    where: {
      refresh_token: token,
    },
  });
  return user;
}
