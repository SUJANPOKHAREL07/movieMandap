import { sign, verify } from 'jsonwebtoken';
import { TLoad } from '../types/login.types';
import { EXPIRE_ACCESS_TOKEN, EXPIRE_REFRESH_TOKEN } from './expireTiming';

const JWT_SECRET = process.env.JWT_SECRETE || '';
if (!JWT_SECRET) {
  throw new Error('Secrete token is absent ');
}

// generating refresh token
function generateRefreshToken(loadToken: TLoad) {
  const token = sign(loadToken, JWT_SECRET, {
    expiresIn: EXPIRE_REFRESH_TOKEN,
  });
  return token;
}
function verifyRefreshToken(refreshToken: string): TLoad {
  const checkRefreshToken = verify(refreshToken, JWT_SECRET);
  return checkRefreshToken as TLoad;
}

// generating access token
function generateAccessToken(loadToken: TLoad) {
  const token = sign(loadToken, JWT_SECRET, {
    expiresIn: EXPIRE_ACCESS_TOKEN,
  });
  return token;
}
function verifyAccessToken(accessToken: string): TLoad {
  const check = verify(accessToken, JWT_SECRET);
  return check as TLoad;
}

export const JWT = {
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
  verifyAccessToken,
};
