// import {
//   EXPIRE_ACCESS_TOKEN,
//   EXPIRE_REFRESH_TOKEN,
// } from '../authMiddleware/expireTiming';

import { JWT } from '../authMiddleware/jwtToken';
import { loginModal, LogoutModal } from '../modal/loginModal';
import { userModal } from '../modal/userModal';

import { TLoad } from '../types/login.types';
import { TReqRes, TResponse } from '../types/user.types';
import { resetPasswordService } from '../userVerifyOTP/resetPassOtpService';
import { comparePassword, hashPassword } from '../utils/passwordHashing';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleLogin(credential: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return { success: false, message: 'Invalid Google token' };
    }

    const { email, name } = payload;
    console.log('🔍 Google token verified for:', email);

    // Check if user exists
    let user = await userModal.searchUserEmail({ email });
    console.log('👤 User search result:', user ? 'Found' : 'Not Found');

    if (!user) {
      // Create new user (Signup via Google)
      const baseName = name || email.split('@')[0];
      const username = baseName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await hashPassword(randomPassword);

      user = await userModal.createUserModal({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      });
      console.log('✅ New Google user created:', email);
    } else {
      console.log('✅ Existing Google user logged in:', email);
    }

    const userId = user.id;
    const role = user.role;
    const userPayload: TLoad = {
      userId,
      role,
    };

    // token generation
    const refresh_token = JWT.generateRefreshToken(userPayload);
    const access_token = JWT.generateAccessToken(userPayload);

    await loginModal.loginUser({
      em: email,
      userId,
      password: user.password, // Existing hashed password
      role,
      refresh_token,
    });

    return {
      success: true,
      message: 'Google Login Success',
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return { success: false, message: 'Google authentication failed' };
  }
}

async function loginUser(email: string, password: string, username: string) {
  if (!email && !username) {
    throw new Error('Email or User name is required');
  }
  // const token = req.headers.refresh_token;

  const searchUser = await loginModal.checkLoginCred({ email, username });
  if (searchUser === null) {
    return { success: false, message: 'SignUp first' };
  }
  // const alreadyloggedIn = await loginModal.alreadyLoggedIn(token);
  // console.log('Already login--->', alreadyloggedIn);
  // if (alreadyloggedIn !== null) {
  //   return {
  //     success: false,
  //     message: 'User already logged in ',
  //   };
  // }
  const compare = await comparePassword(password, searchUser.password);
  if (compare == false) {
    return { success: false, message: "Passowrd didn't match" };
  }
  const userId = searchUser.id;
  const role = searchUser.role;
  const userPayload: TLoad = {
    userId,
    role,
  };
  // token generation
  const refresh_token = JWT.generateRefreshToken(userPayload);
  const access_token = JWT.generateAccessToken(userPayload);
  console.log('rerfresh token genreate:', refresh_token);
  console.log('access token genreate:', access_token);
  const em = searchUser.email;
  const createLogin = await loginModal.loginUser({
    em,
    userId,
    password: searchUser.password,
    role,
    refresh_token,
  });
  if (!createLogin) {
    return {
      success: false,
      message: 'Failed to login',
    };
  }
  return {
    success: true,
    message: 'Success Login',
    accessToken: access_token,
    refreshToken: refresh_token,
  };
}
async function logoutService(
  userId: string,
  token: string
): Promise<TResponse> {
  console.log('token in the user service::', token);
  const searchLog = await loginModal.getLoginInfo(token);
  if (searchLog === null) {
    return {
      success: false,
      message: 'No log info found! Login First',
    };
  }
  const tokenExist = await LogoutModal.checkToken(token);
  if (tokenExist === null) {
    return {
      success: false,
      message: 'No user found',
    };
  }
  const logout = await LogoutModal.logout(tokenExist.id);
  if (!logout) {
    return {
      success: false,
      message: 'Failed to logout ',
    };
  }
  return {
    success: true,
    message: 'logout success',
  };
}
export const loginService = {
  loginUser,
  googleLogin,
  logoutService,
  resetPassword,
  resendOtp,
  verifyOtp,
  updateNewPassword,
};

// reset password

async function resetPassword(
  { req }: TReqRes,
  email?: string,
  username?: string
) {
  if (typeof email === 'undefined' && typeof username === 'undefined') {
    throw new Error('Email or user name is required');
  }
  let user: any;
  if (typeof email === 'undefined') {
    user = await userModal.searchUserName({ username });
    console.log('user name and email-inside if:', user.email);
    if (user === null) {
      throw new Error('No user found');
    }
    req.session.email = user.email;
    const data = await resetPasswordService.sendOtp(user.email, req.session);
    if (data.success !== true) {
      return {
        success: false,
        message: 'Failed to send the otp',
      };
    }
    return {
      success: true,
      message: 'Otp sent to your email',
    };
  }

  user = await userModal.searchUserEmail({ email });
  console.log('email from the user name:', user?.email);

  if (user === null) {
    throw new Error('No user found');
  }
  req.session.email = user.email;
  // console.log('session email save--', req.session.email);
  const data = await resetPasswordService.sendOtp(user.email, req.session);
  if (data.success !== true) {
    return {
      success: false,
      message: 'Failed to send the otp',
    };
  }
  return {
    success: true,
    message: 'Otp sent to your email',
  };
}
async function resendOtp(req: any) {
  console.log('Session data in the session', req.ession);
  const send = await resetPasswordService.resendOtp(req.session);
  if (send.success !== true) {
    return {
      success: false,
      message: 'Failed to send agian the email',
    };
  }
  return {
    success: true,
    message: 'otp resend',
  };
}
async function verifyOtp(otp: string, req: any) {
  console.log('otp entered by the user', otp);
  console.log('otp entered by the user-SESSION DATA', req.session);
  const verify = await resetPasswordService.verifyOtp(otp, req.session);
  if (verify.success !== true) {
    return {
      message: 'Failed to veify the otp',
      success: false,
    };
  }
  return {
    success: true,
    message: 'Otp verified',
  };
}
async function updateNewPassword(newPassword: string, req: any) {
  const data = await resetPasswordService.resetPassword(
    newPassword,
    req.session
  );
  if (data.success !== true) {
    return {
      success: false,
      message: 'Failed to update new password',
    };
  }
  return {
    success: true,
    message: 'Passoword updated',
  };
}
