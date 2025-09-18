import prisma from '../prisma/client';

async function createUserModal(data: {
  username: string;
  email: string;
  password: string;
}) {
  console.log('data in the modal:', data);
  const register = prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
    },
  });

  return register;
}
async function getUserModal() {
  const getuser = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  return getuser;
}
async function searchUserName(data: { username?: string }) {
  const search = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  console.log('search result in the modal:', search);
  return search;
}
async function searchUserEmail(data: { email?: string }) {
  const search = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  console.log('search result in the modal:', search);
  return search;
}
async function deleteUserModal(email: string) {
  console.log('delete user modal', email);
  const del = await prisma.user.delete({
    where: {
      email: email,
    },
  });
  if (!del) {
    return {
      message: 'Modal failed to delete user',
      data: del,
    };
  }
  return {
    message: 'User deleted ',
  };
}
async function updateUserModal(
  email: string,
  username?: string,
  password?: string
) {
  const update = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      username: username,
      password: password,
    },
  });
  return update;
}
export const userModal = {
  createUserModal,
  getUserModal,
  searchUserName,
  searchUserEmail,
  deleteUserModal,
  updateUserModal,
};
