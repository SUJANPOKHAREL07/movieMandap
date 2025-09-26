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
  // console.log('token of the conetxt::', token);
  if (!token) {
    // console.log('!tokne inside');
    return { user: null, token: null };
  }

  try {
    // console.log('Inside the user verificarion try catch');
    const user = await JWT.verifyRefreshToken(token);
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
  } catch (err) {
    return { user: null, token: null };
  }
};
