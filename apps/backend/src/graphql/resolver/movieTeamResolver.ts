import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {
  TMovieTeamProductionCompanyCreate,
  TMovieTeamProductionCompanyUpdate,
  TPersonCreate,
} from '../../types/movieTeam.types';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { uploadFile } from '../../utils/uploadHandling';
import {
  movieTeamRegister,
  movieTeamServiceDelete,
  movieTeamServiceGet,
  movieTeamServiceUpdate,
} from '../../service/movieTeamService';

export const movieTeamResolver = {
  Upload: GraphQLUpload,
  Query: {
    getAllProductionCompany: async () => {
      const data = await movieTeamServiceGet.getAllProductionCopany();
      return data.data;
    },
    getAllMovieProductionCompany: async () => {
      const data = await movieTeamServiceGet.getAllMovieProductionCopany();
      return data.data;
    },
    getAllCastMember: async () => {
      const data = await movieTeamServiceGet.getAllCastMember();
      return data.data;
    },
    getAllCrewMember: async () => {
      const data = await movieTeamServiceGet.getAllCrewMember();
      return data.data;
    },
    getAllMoviePerson: async () => {
      const data = await movieTeamServiceGet.getAllMoviePerson();
      return data.data;
    },
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
      let logoPath = '';
      if (typeof logo !== 'undefined') {
        logoPath = await uploadFile(logo);
      }
      console.log('logo path ----', logoPath);
      const finaldata = { logoPath, ...data };
      console.log('Final data ---', finaldata);
      return await movieTeamRegister.registerProductionCompany(finaldata);
    },
    updateProductionCompany: async (
      _: any,
      args: TMovieTeamProductionCompanyUpdate,
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
      const { logo, ...data } = args;
      console.log('data in the resolver down---', args);
      let logoPath = '';
      if (typeof logo !== 'undefined') {
        logoPath = await uploadFile(logo);
      }
      console.log('logo path ----', logoPath);
      const finaldata = { logoPath, ...data };
      console.log('Final data ---', finaldata);
      return await movieTeamServiceUpdate.updateProductionComany(finaldata);
    },
    deleteProductionCompany: async (_: any, { id }: any, context: any) => {
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
      return await movieTeamServiceDelete.deleteProductionCompany(id);
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
    updateMovieProductionCompany: async (
      _: any,
      { id, companyId, movieId }: any,
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
      return await movieTeamServiceUpdate.updateMovieProductionComapny(
        id,
        companyId,
        movieId
      );
    },
    deleteMovieProductionCompany: async (_: any, { id }: any, context: any) => {
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
      return await movieTeamServiceDelete.deleteMovieProductionCompany(id);
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
    updatePerson: async (
      _: any,
      { id, adult, birthPlace, name, deathDay, birthDay, socialPath }: any,
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
      return await movieTeamServiceUpdate.updateMoviePerson(
        id,
        adult,
        birthPlace,
        name,
        deathDay,
        birthDay,
        socialPath
      );
    },
    deletePerson: async (_: any, { id }: any, context: any) => {
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
      return await movieTeamServiceDelete.deleteMoviePerson(id);
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
    updateCrewMember: async (
      _: any,
      { id, department, job, personId, movieId }: any,
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
      return await movieTeamServiceUpdate.updateCrewMember(
        id,
        department,
        job,
        personId,
        movieId
      );
    },
    deleteCrewMember: async (_: any, { id }: any, context: any) => {
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
      return await movieTeamServiceDelete.deleteCrewMember(id);
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
    updateCastMember: async (
      _: any,
      { id, character, creditId, movieId, personId }: any,
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
      return await movieTeamServiceUpdate.updateCastMember(
        id,
        character,
        creditId,
        movieId,
        personId
      );
    },
    deleteCastMember: async (_: any, { id }: any, context: any) => {
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
      return await movieTeamServiceDelete.deleteCastMember(id);
    },
  },
};
