import { movieTeamModalCreate, searchMovieTeam } from '../modal/movieTeamModal';
import {
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
  moviename: string,
  comapnyname: string
) => {
  try {
    const movie = await searchMovieTeam.findMovieByName(moviename);
    if (!movie) {
      return {
        success: false,
        message: 'No movie Found',
      };
    }
    const company = await searchMovieTeam.findComanyByName(comapnyname);
    if (!company) {
      return {
        success: false,
        message: 'No Production company found',
      };
    }
    const movieId = Number(movie?.id);
    const companyId = Number(company?.id);
    const register = await movieTeamModalCreate.registerMovieProductionCompany({
      movieId,
      companyId,
    });
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
const registerCrewMember = async (
  personName: string,
  movieName: string,
  department: string,
  job: string
) => {
  try {
    const movie = await searchMovieTeam.findMovieByName(movieName);
    if (!movie) {
      return {
        success: false,
        message: 'No movie found',
      };
    }
    const movieId = Number(movie.id);
    const person = await searchMovieTeam.findPersonByName(personName);
    if (!person) {
      return {
        success: false,
        message: 'No person was found',
      };
    }
    const personId = Number(person.id);
    const data = { movieId, personId, department, job };
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
const registerCastMember = async (
  movieName: string,
  personName: string,
  character: string,
  creditId: string
) => {
  try {
    const movie = await searchMovieTeam.findMovieByName(movieName);
    if (!movie) {
      return {
        success: false,
        message: 'No movie found',
      };
    }
    const movieId = Number(movie.id);
    const person = await searchMovieTeam.findPersonByName(personName);
    if (!person) {
      return {
        success: false,
        message: 'No person was found',
      };
    }
    const personId = Number(person.id);
    const data = { movieId, personId, character, creditId };
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
