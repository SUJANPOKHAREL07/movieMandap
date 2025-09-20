import {
  EXPIRE_ACCESS_TOKEN,
  EXPIRE_REFRESH_TOKEN,
} from '../authMiddleware/expireTiming';
import { JWT } from '../authMiddleware/jwtToken';
import { loginModal } from '../modal/loginModal';

import { TLoad } from '../types/login.types';
import { comparePassword } from '../utils/passwordHashing';

async function loginUser(
  email: string,
  password: string,
  username: string,
  req: any,
  res: any
) {
  if (!email && !username) {
    throw new Error('Email or User name is required');
  }

  const searchUser = await loginModal.checkLoginCred({ email, username });
  if (searchUser === null) {
    return { success: false, message: 'SignUp first' };
  }
  const alreadyloggedIn = await loginModal.alreadyLoggedIn(searchUser?.email);
  if (alreadyloggedIn) {
    return {
      success: false,
      message: 'User already logged in ',
    };
  }
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
  // cookies set:
  res.cookie('refresh_token', refresh_token, {
    path: '/',
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
    expireIn: new Date(Date.now() + EXPIRE_REFRESH_TOKEN * 1000),
  });
  res.cookie('access_token', access_token, {
    path: '/',
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
    expireIn: new Date(Date.now() + EXPIRE_ACCESS_TOKEN * 1000),
  });
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
  return { success: true, message: 'Success Login' };
}
export const loginService = { loginUser };
