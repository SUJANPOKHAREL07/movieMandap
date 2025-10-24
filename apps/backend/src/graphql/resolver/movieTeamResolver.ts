import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {
  TMovieTeamProductionCompanyCreate,
  TPersonCreate,
} from '../../types/movieTeam.types';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { uploadFile } from '../../utils/uploadHandling';
import { movieTeamRegister } from '../../service/movieTeamService';

export const movieTeamResolver = {
  Upload: GraphQLUpload,
  Query: {
    
  },
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
      return await movieTeamRegister.registerMovieProductionCompany(
        moviename,
        companyname
      );
    },
    registerPerson: async (_: any, args: TPersonCreate, context: any) => {
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
      return await movieTeamRegister.registerPerson(args);
    },
    registerCrewMember: async (
      _: any,
      { personName, movieName, department, job }: any,
      context: any
    ) => {
      if (
        (typeof personName ||
          typeof movieName ||
          typeof department ||
          typeof job) !== 'string'
      ) {
        return {
          success: false,
          message: 'Value must be a string',
        };
      }
      return await movieTeamRegister.registerCrewMember(
        personName,
        movieName,
        department,
        job
      );
    },
    registerCastMember: async (
      _: any,
      { movieName, personName, character, creditId }: any,
      context: any
    ) => {
      if (
        (typeof movieName ||
          typeof personName ||
          typeof character ||
          typeof creditId) !== 'string'
      ) {
        return {
          success: false,
          message: 'Movie name person name and character must be string',
        };
      }
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
      return await movieTeamRegister.registerCastMember(
        movieName,
        personName,
        character,
        creditId
      );
    },
  },
};
