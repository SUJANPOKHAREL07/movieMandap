import { loginService } from '../../service/loginService';
import { TLogin } from '../../types/login.types';
import { TReqRes } from '../../types/user.types';

export const loginResolver = {
  Mutation: {
    loginUser: async (
      _: any,
      { email, password, username }: TLogin,
      { req, res }: TReqRes
    ) => {
      return await loginService.loginUser(email, password, username, req, res);
    },
    logoutUser: async (_: any, __: any, context: any) => {
      if (context.token === '') {
        return {
          success: false,
          message: 'No header found',
        };
      }
      return await loginService.logoutService(
        context.user.userId,
        context.token
      );
    },
  },
};
