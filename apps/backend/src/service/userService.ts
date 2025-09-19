import { userModal } from '../modal/userModal';
import { TCreateUser } from '../types/user.types';
import { otpService } from '../userVerifyOTP/otpService';
import { hashPassword } from '../utils/passwordHashing';

declare module 'express-session' {
  interface SessionData {
    email?: string;
    pendingUserData?: any;
  }
}

export const getUserController = async () => {
  return await userModal.getUserModal();
};

export const createUserController = async (
  { email, username, password, role }: TCreateUser,
  req: any
) => {
  if (!username || !email || !password) {
    throw new Error('All fields are required');
  }

  const searchNameExist = await userModal.searchUserName({ username });
  const searchEmailExist = await userModal.searchUserEmail({ email });

  if (searchNameExist || searchEmailExist) {
    throw new Error('User already registered');
  }

  // ✅ Await hashing
  const passwordHashed = await hashPassword(password);

  // ✅ Await pending user creation
  const pendingUserData = await userModal.pendingUser({
    username,
    email,
    password: passwordHashed,
    role,
  });

  // ✅ Save into session
  req.session.pendingUserData = pendingUserData;
  req.session.email = email;
  console.log(req.session.pendingUserData);
  await new Promise<void>((resolve, reject) =>
    req.session.save((err: any) => (err ? reject(err) : resolve()))
  );

  // ✅ Send OTP
  await otpService.sendOtp(email, req.session);

  return { success: true, message: 'OTP sent to email' };
};

export const verifyOtpService = async (otp: string, req: any) => {
  console.log('verify otp session data :', req.session.pendingUserData);
  if (!req.session.pendingUserData) {
    return { success: false, message: 'No pending user data' };
  }

  const { success, message } = await otpService.verifyOtp(otp, req.session);
  // console.log('check otp:', checkOtp);
  if (!success) return { success, message };

  // const email = req.session.email;
  // Save user permanently
  req.session.pendingUserData.verified = true;
  // console.log('is verifed:', verified);
  await userModal.createUserModal(req.session.pendingUserData);
  // await userModal.updateVerification(email);

  req.session.pendingUserData = null;
  req.session.email = undefined;
  await new Promise<void>((res, rej) =>
    req.session.save((err: any) => (err ? rej(err) : res()))
  );

  return { success: true, message: 'User created successfully' };
};

export const resendOtpController = async (email: string, req: any) => {
  if (
    !req.session.pendingUserData ||
    req.session.pendingUserData.email !== email
  ) {
    return { success: false, message: 'No pending user session found' };
  }

  await otpService.resendOtp(req.session);
  return { success: true, message: 'OTP resent' };
};
