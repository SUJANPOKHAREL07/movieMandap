import { TLogin } from '../types/login.types';
import prisma from '../prisma/client';

export const loginModal = {
  checkLoginCred,
};

async function checkLoginCred(data: TLogin) {
  const log = await prisma.user.findMany({
    where: {
      email: data.email,
      password: data.password,
    },
  });
  return log;
}
