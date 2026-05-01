import { GraphQLUpload } from 'graphql-upload';
import {
  TSeriesTeamProductionCompanyCreate,
  TSeriesTeamProductionCompanyUpdate,
  TPersonCreate,
} from '../../types/seriesTeam.types';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { uploadFile } from '../../utils/cloudnary';
import {
  seriesTeamRegister,
  seriesTeamServiceDelete,
  seriesTeamServiceGet,
  seriesTeamServiceUpdate,
} from '../../service/seriesTeamService';

export const seriesTeamResolver = {
  Upload: GraphQLUpload,
  Query: {
    __removed_getAllProductionCompany: async () => {
      const data = await seriesTeamServiceGet.getAllProductionCopany();
      return data.data;
    },
    getAllSeriesProductionCompany: async () => {
      const data = await seriesTeamServiceGet.getAllSeriesProductionCopany();
      return data.data;
    },
    getAllSeriesCastMember: async () => {
      const data = await seriesTeamServiceGet.getAllCastMember();
      return data.data;
    },
    getAllSeriesCrewMember: async () => {
      const data = await seriesTeamServiceGet.getAllCrewMember();
      return data.data;
    },
    __removed_getAllSeriesPerson: async () => {
      const data = await seriesTeamServiceGet.getAllSeriesPerson();
      return data.data;
    },
  },
  Mutation: {
    __removed_registerProductionCompany: async (
      _: any,
      args: TSeriesTeamProductionCompanyCreate,
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
      return await seriesTeamRegister.registerProductionCompany(finaldata);
    },
    __removed_updateProductionCompany: async (
      _: any,
      args: TSeriesTeamProductionCompanyUpdate,
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
      return await seriesTeamServiceUpdate.updateProductionComany(finaldata);
    },
    __removed_deleteProductionCompany: async (_: any, { id }: any, context: any) => {
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
      return await seriesTeamServiceDelete.deleteProductionCompany(id);
    },

    registerSeriesProductionCompany: async (
      _: any,
      { seriesname, companyname }: any,
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
      return await seriesTeamRegister.registerSeriesProductionCompany(
        seriesname,
        companyname
      );
    },
    updateSeriesProductionCompany: async (
      _: any,
      { id, companyId, seriesId }: any,
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
      return await seriesTeamServiceUpdate.updateSeriesProductionComapny(
        id,
        companyId,
        seriesId
      );
    },
    deleteSeriesProductionCompany: async (_: any, { id }: any, context: any) => {
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
      return await seriesTeamServiceDelete.deleteSeriesProductionCompany(id);
    },
    __removed_registerPerson: async (_: any, args: TPersonCreate, context: any) => {
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
      return await seriesTeamRegister.registerPerson(args);
    },
    __removed_updatePerson: async (
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
      return await seriesTeamServiceUpdate.updateSeriesPerson(
        id,
        adult,
        birthPlace,
        name,
        deathDay,
        birthDay,
        socialPath
      );
    },
    __removed_deletePerson: async (_: any, { id }: any, context: any) => {
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
      return await seriesTeamServiceDelete.deleteSeriesPerson(id);
    },
    registerSeriesCrewMember: async (
      _: any,
      { personName, seriesName, department, job }: any,
      context: any
    ) => {
      if (
        (typeof personName ||
          typeof seriesName ||
          typeof department ||
          typeof job) !== 'string'
      ) {
        return {
          success: false,
          message: 'Value must be a string',
        };
      }
      return await seriesTeamRegister.registerCrewMember(
        personName,
        seriesName,
        department,
        job
      );
    },
    updateSeriesCrewMember: async (
      _: any,
      { id, department, job, personId, seriesId }: any,
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
      return await seriesTeamServiceUpdate.updateCrewMember(
        id,
        department,
        job,
        personId,
        seriesId
      );
    },
    deleteSeriesCrewMember: async (_: any, { id }: any, context: any) => {
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
      return await seriesTeamServiceDelete.deleteCrewMember(id);
    },
    registerSeriesCastMember: async (
      _: any,
      { seriesName, personName, character, creditId }: any,
      context: any
    ) => {
      if (
        (typeof seriesName ||
          typeof personName ||
          typeof character ||
          typeof creditId) !== 'string'
      ) {
        return {
          success: false,
          message: 'Series name person name and character must be string',
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
      return await seriesTeamRegister.registerCastMember(
        seriesName,
        personName,
        character,
        creditId
      );
    },
    updateSeriesCastMember: async (
      _: any,
      { id, character, creditId, seriesId, personId }: any,
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
      return await seriesTeamServiceUpdate.updateCastMember(
        id,
        character,
        creditId,
        seriesId,
        personId
      );
    },
    deleteSeriesCastMember: async (_: any, { id }: any, context: any) => {
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
      return await seriesTeamServiceDelete.deleteCastMember(id);
    },
  },
};
