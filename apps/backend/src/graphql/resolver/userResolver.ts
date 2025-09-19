import {
  createUserController,
  verifyOtpService,
  getUserController,
} from '../../service/userService';

export const userResolvers = {
  Query: {
    users: async () => getUserController(),
  },
  Mutation: {
    createUser: async (_: any, args: any, { req }: any) =>
      createUserController(args.email, args.username, args.password, req),

    verifyOtp: async (_: any, { otp }: any, { req }: any) =>
      verifyOtpService(otp, req),

    // resendOtp: async (_: any, { email }: any, { req }: any) =>
    //   resendOtpController(email, req),
  },
};
