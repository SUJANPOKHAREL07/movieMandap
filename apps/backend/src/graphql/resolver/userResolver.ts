import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
  verifyOtpService,
} from '../../service/userService';

export const userResolvers = {
  Query: {
    users: async () => {
      return await getUserController();
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      data: { email: string; username: string; password: string },
      { req }: any
    ) => {
      console.log('resolver:', data);
      return await createUserController(
        data.email,
        data.username,
        data.password,
        req
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
    verifyOtp: async (_: any, data: { otp: string }, { req }: any) => {
      return await verifyOtpService(data.otp, req);
    },
  },
};
