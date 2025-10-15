import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { TMovieTeamProductionCompanyCreate } from '../../types/movieTeam.types';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { uploadFile } from '../../utils/uploadHandling';
import { movieTeamRegister } from '../../service/movieTeamService';

export const movieTeamResolver = {
  Upload: GraphQLUpload,
  Query: {},
  Mutation: {
    registerProductionCompany: async (
      _: any,
      args: TMovieTeamProductionCompanyCreate,
      token: any
    ) => {
      console.log('data in the resolver ', token);
      const auth = await authContextMiddleware(token);
      //   console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userRole = auth.user?.role;
      console.log('logged in user role ', userRole);
      if (userRole === 'user') {
        return {
          success: false,
          message: 'User are not allowed to create',
        };
      }
      const { logo, ...data } = args;
      console.log('data in the resolver down---', args);
      const logoPath = await uploadFile(logo);
      console.log('logo path ----', logoPath);
      const finaldata = { logoPath, ...data };
      console.log('Final data ---', finaldata);
      return await movieTeamRegister.registerProductionCompany(finaldata);
    },
    registerMovieProductionCompany: async (
      _: any,
      { moviename, companyname }: any,
      context: any
    ) => {
      const auth = await authContextMiddleware(context);
      //   console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userRole = auth.user?.role;
      console.log('logged in user role ', userRole);
      if (userRole === 'user') {
        return {
          success: false,
          message: 'User are not allowed to create',
        };
      }
      console.log('params daata---', context.params);
      const movieId = context.params;
      const companyId = context.params;
      const data = { movieId, companyId };
      console.log('data in the resolver----', movieId, companyId);
      return await movieTeamRegister.registerMovieProductionCompany(data);
    },
  },
};
