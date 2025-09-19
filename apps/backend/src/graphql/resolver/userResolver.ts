import {
  createUserController,
  verifyOtpService,
  getUserController,
  resendOtpController,
} from '../../service/userService';
import { TCreateUser } from '../../types/user.types';

export const userResolvers = {
  Query: {
    users: async () => getUserController(),
  },
  Mutation: {
    createUser: async (_: any, args: TCreateUser, { req }: any) =>
      createUserController(args, req),

    verifyOtp: async (_: any, { otp }: any, { req }: any) =>
      verifyOtpService(otp, req),

    resendOtp: async (_: any, { email }: any, { req }: any) =>
      resendOtpController(email, req),
  },
};
