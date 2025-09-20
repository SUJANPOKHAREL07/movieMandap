import { loginService } from '../../service/loginService';
import { TLogin } from '../../types/login.types';

export const loginResolver = {
  Mutation: {
    loginUser: async (
      _: any,
      { email, password, username }: TLogin,
      { req, res }: any
    ) => {
      return await loginService.loginUser(email, password, username, req, res);
    },
  },
};
