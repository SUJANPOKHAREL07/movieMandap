import { sign, verify } from 'jsonwebtoken';
import { TLoad } from '../types/login.types';
import { EXPIRE_ACCESS_TOKEN, EXPIRE_REFRESH_TOKEN } from './expireTiming';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRETE || '';
  if (!secret) {
    throw new Error('Secrete token is absent');
  }
  return secret;
};

// generating refresh token
function generateRefreshToken(loadToken: TLoad) {
  const token = sign(loadToken, getJwtSecret(), {
    expiresIn: EXPIRE_REFRESH_TOKEN,
  });
  return token;
}
function verifyRefreshToken(refreshToken: string): TLoad {
  const checkRefreshToken = verify(refreshToken, getJwtSecret());
  if (typeof checkRefreshToken !== 'string') {
    // console.log('failed the user verification');
  }
  return checkRefreshToken as TLoad;
}

// generating access token
function generateAccessToken(loadToken: TLoad) {
  const token = sign(loadToken, getJwtSecret(), {
    expiresIn: EXPIRE_ACCESS_TOKEN,
  });
  return token;
}
function verifyAccessToken(accessToken: string): TLoad {
  const check = verify(accessToken, getJwtSecret());
  return check as TLoad;
}

export const JWT = {
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
  verifyAccessToken,
};
