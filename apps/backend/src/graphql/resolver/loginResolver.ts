import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
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
      const auth = await authContextMiddleware(context);
      console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      return await loginService.logoutService(
        String(auth.user?.userId),
        auth.token
      );
    },
  },
};
