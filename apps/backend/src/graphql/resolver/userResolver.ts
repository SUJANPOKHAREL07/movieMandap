import {
  createUserController,
  verifyOtpService,
  getUserController,
  resendOtpController,
} from '../../service/userService';
import { TContext, TCreateUser } from '../../types/user.types';

export const userResolvers = {
  Query: {
    users: async () => getUserController(),
  },
  Mutation: {
    createUser: async (_: any, args: TCreateUser, { req }: TContext) =>
      createUserController(args, req),

    verifyOtp: async (_: any, { otp }: any, { req }: TContext) =>
      verifyOtpService(otp, req),

    resendOtp: async (_: any, { email }: any, { req }: TContext) =>
      resendOtpController(email, req),
  },
};
