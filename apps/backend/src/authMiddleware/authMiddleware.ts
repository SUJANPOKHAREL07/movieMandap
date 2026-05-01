// import { TReqRes } from '../types/user.types';
import { JWT } from './jwtToken';

export const authContextMiddleware = async ({ req, res }: any) => {
  // console.log('refresh token ----', req.headers.refresh_token);
  // console.log('access token ----', req.headers.access_token);

  // const accessToken = req.headers.access_token;
  // if (accessToken == undefined) {
  //   return {
  //     user: null,
  //     token: null,
  //   };
  // }
  const token =
    req.headers.authorization?.replace('Bearer ', '') ||
    (req.headers.refresh_token as string);
  console.log('--- Auth Middleware ---');
  console.log('authorization header:', req.headers.authorization);
  console.log('token extracted:', token);

  if (!token) {
    console.error('No token found in headers!');
    return { user: null, token: null };
  }

  try {
    // Use verifyAccessToken since we're pulling Bearer <accessToken>
    const user = await JWT.verifyAccessToken(token);

    // console.log('user verification', user);

    // const access = await JWT.verifyAccessToken(accessToken);
    // if (!access) {
    //   return {
    //     success: false,
    //     message: 'Failed to verify access token',
    //   };
    // }

    // console.log('user verifcation::', user.userId);
    // console.log('user -----', user);

    return { user, token, req, res };
  } catch (err: any) {
    console.error('JWT verification failed:', err.message);
    return { user: null, token: null };
  }
};
