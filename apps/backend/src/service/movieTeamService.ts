import { movieTeamModalCreate } from '../modal/movieTeamModal';
import {
  TCastMember,
  TCrewMember,
  TMovieProductionCompany,
  TMovieTeamProductionCompanyCreate,
  TPersonCreate,
} from '../types/movieTeam.types';

const registerProductionCompany = async (
  data: TMovieTeamProductionCompanyCreate
) => {
  try {
    const register = await movieTeamModalCreate.registerProductionCompany(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the production company',
      };
    }
    return {
      success: true,
      message: 'Production comapny regsiter',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error : Failed to register the production comapny',
    };
  }
};
const registerMovieProductionCompany = async (
  data: TMovieProductionCompany
) => {
  try {
    const register = await movieTeamModalCreate.registerMovieProductionCompany(
      data
    );
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the production company for movie',
      };
    }
    return {
      success: true,
      message: 'Production comapny of the movie added',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to add the movie production company',
    };
  }
};
const registerPerson = async (data: TPersonCreate) => {
  try {
    const register = await movieTeamModalCreate.registerMoviePerson(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the person ',
      };
    }
    return {
      success: true,
      message: 'Person register successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error :Failed to register the person',
    };
  }
};
const registerCrewMember = async (data: TCrewMember) => {
  try {
    const register = await movieTeamModalCreate.registerCrewMember(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the crew member',
      };
    }
    return {
      success: true,
      message: 'Crew member registerd successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error: Failed to register the crew member',
    };
  }
};
const registerCastMember = async (data: TCastMember) => {
  try {
    const register = await movieTeamModalCreate.registerCastMember(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the cast member',
      };
    }
    return {
      success: true,
      message: 'Cast member register successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to register the cast member',
    };
  }
};
export const movieTeamRegister = {
  registerProductionCompany,
  registerMovieProductionCompany,
  registerPerson,
  registerCrewMember,
  registerCastMember,
};
