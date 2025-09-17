import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from '../../controller/userController';

export const userResolvers = {
  Query: {
    users: async () => {
      return await getUserController();
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      data: { email: string; password: string; username: string }
    ) => {
      console.log('resolver:', data);
      return await createUserController(
        data.email,
        data.password,
        data.username
      );
    },
    deleteUser: async (_: any, data: { email: string }) => {
      return await deleteUserController(data.email);
    },
    updateUser: async (
      _: any,
      data: { email: string; username?: string; password?: string }
    ) => {
      return updateUserController(data.email, data.username, data.password);
    },
  },
};
