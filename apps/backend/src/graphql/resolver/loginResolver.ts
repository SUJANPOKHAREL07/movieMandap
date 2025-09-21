import { loginService } from '../../service/loginService';
import { TLogin } from '../../types/login.types';
import { TContext } from '../../types/user.types';

export const loginResolver = {
  Mutation: {
    loginUser: async (
      _: any,
      { email, password, username }: TLogin,
      { req, res }: TContext
    ) => {
      return await loginService.loginUser(email, password, username, req, res);
    },
    logoutUser: async (_: any, __: any, { req, res }: TContext) => {
      return await loginService.logoutService(req, res);
    },
  },
};
