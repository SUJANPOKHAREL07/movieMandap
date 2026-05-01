import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { userService } from '../../service/userService';
import { TCreateUser, TReqRes } from '../../types/user.types';
import { userModal } from '../../modal/userModal';

export const userResolvers = {
  Query: {
    users: async () => userService.getUserController(),
    getMe: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null || !auth.user?.userId) return null;
      const userId = Number(auth.user.userId);
      return await userModal.searchUserById(userId);
    },
  },
  Mutation: {
    createUser: async (_: any, args: TCreateUser, context: TReqRes) => {
      console.log(args);
      // console.log('user context::', context.req);
      return await userService.createUserController(args, context.req);
    },

    verifyOtp: async (_: any, { otp }: any, { req }: TReqRes) => {
      return userService.verifyOtpService(otp, req);
    },
    resendOtp: async (_: any, { email }: any, { req }: TReqRes) => {
      return userService.resendOtpController(email, req);
    },
    updateUsername: async (_: any, { newUsername }: any, context: string) => {
      if (typeof newUsername !== 'string') {
        return {
          success: false,
          message: 'Username must be the string',
        };
      }
      const auth = await authContextMiddleware(context);
      // console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userId = Number(auth.user?.userId);
      const user = newUsername;
      console.log('user name in the resolver', user);
      return await userService.updateUserDetail(user, userId);
    },
  },
};
