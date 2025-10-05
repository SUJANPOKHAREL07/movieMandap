import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { userService } from '../../service/userService';
import { TCreateUser, TReqRes } from '../../types/user.types';

export const userResolvers = {
  Query: {
    users: async () => userService.getUserController(),
  },
  Mutation: {
    createUser: async (_: any, args: TCreateUser, context: TReqRes) => {
      console.log(args);
      // console.log('user context::', context.req);
      await userService.createUserController(args, context.req);
    },

    verifyOtp: async (_: any, { otp }: any, { req }: TReqRes) => {
      userService.verifyOtpService(otp, req);
    },
    resendOtp: async (_: any, { email }: any, { req }: TReqRes) => {
      userService.resendOtpController(email, req);
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
