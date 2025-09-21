import {
  createUserController,
  verifyOtpService,
  getUserController,
  resendOtpController,
} from '../../service/userService';
import { TCreateUser, TReqRes } from '../../types/user.types';

export const userResolvers = {
  Query: {
    users: async () => getUserController(),
  },
  Mutation: {
    createUser: async (_: any, args: TCreateUser, { req }: TReqRes) =>
      createUserController(args, req),

    verifyOtp: async (_: any, { otp }: any, { req }: TReqRes) =>
      verifyOtpService(otp, req),

    resendOtp: async (_: any, { email }: any, { req }: TReqRes) =>
      resendOtpController(email, req),
  },
};
