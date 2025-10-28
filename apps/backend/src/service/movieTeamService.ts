import {
  movieTeamModalCreate,
  movieTeamModalDelete,
  movieTeamModalGet,
  movieTeamModalUpdate,
  searchMovieTeam,
} from '../modal/movieTeamModal';
import {
  TMovieTeamProductionCompanyCreate,
  TMovieTeamProductionCompanyUpdate,
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
const updateProductionComany = async (
  data: TMovieTeamProductionCompanyUpdate
) => {
  try {
    const update = await movieTeamModalUpdate.updateProductionComany(
      data.id,
      data.logoPath,
      data.name,
      data.originCountry
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the production company data',
      };
    }
    return {
      success: true,
      message: 'Production company data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateMovieProductionComapny = async (
  id: number,
  companyId?: number,
  movieId?: number
) => {
  try {
    const update = await movieTeamModalUpdate.updateMovieProductionComapny(
      id,
      companyId,
      movieId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the movie productioin company',
      };
    }
    return {
      success: true,
      message: 'Updated the movie production company data',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateMoviePerson = async (
  id: number,
  adult?: boolean,
  birthPlace?: string,
  name?: string,
  deathDay?: Date,
  birthDay?: Date,
  socialPath?: string
) => {
  try {
    const update = await movieTeamModalUpdate.updateMoviePerson(
      id,
      adult,
      birthPlace,
      name,
      deathDay,
      birthDay,
      socialPath
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the person data',
      };
    }
    return {
      success: false,
      message: 'Person data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateCrewMember = async (
  id: number,
  department?: string,
  job?: string,
  personId?: number,
  movieId?: number
) => {
  try {
    const update = await movieTeamModalUpdate.updateCrewMember(
      id,
      department,
      job,
      personId,
      movieId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the crew member',
      };
    }
    return {
      success: true,
      message: 'Crew member data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateCastMember = async (
  id: number,
  character?: string,
  creditId?: string,
  movieId?: number,
  personId?: number
) => {
  try {
    const update = await movieTeamModalUpdate.updateCastMember(
      id,
      character,
      creditId,
      movieId,
      personId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the cast member data',
      };
    }
    return {
      success: true,
      message: 'Update the cast member data ',
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
export const movieTeamServiceUpdate = {
  updateCastMember,
  updateCrewMember,
  updateMoviePerson,
  updateMovieProductionComapny,
  updateProductionComany,
};
const deleteProductionCompany = async (id: number) => {
  try {
    const del = await movieTeamModalDelete.deleteProductionCompany(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteMovieProductionCompany = async (id: number) => {
  try {
    const del = await movieTeamModalDelete.deleteMovieProductionCompany(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteMoviePerson = async (id: number) => {
  try {
    const del = await movieTeamModalDelete.deleteMoviePerson(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteCastMember = async (id: number) => {
  try {
    const del = await movieTeamModalDelete.deleteCastMember(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteCrewMember = async (id: number) => {
  try {
    const del = await movieTeamModalDelete.deleteCrewMember(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const movieTeamServiceDelete = {
  deleteCastMember,
  deleteCrewMember,
  deleteMoviePerson,
  deleteMovieProductionCompany,
  deleteProductionCompany,
};
const getAllProductionCopany = async () => {
  try {
    const data = await movieTeamModalGet.getAllMovieProductionCompany();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllMovieProductionCopany = async () => {
  try {
    const data = await movieTeamModalGet.getAllMovieProductionCompany();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All movie production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllCastMember = async () => {
  try {
    const data = await movieTeamModalGet.getAllCastMember();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All movie production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllCrewMember = async () => {
  try {
    const data = await movieTeamModalGet.getAllCrewMember();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All movie production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllMoviePerson = async () => {
  try {
    const data = await movieTeamModalGet.getAllMoviePerson();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All movie production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
export const movieTeamServiceGet = {
  getAllCastMember,
  getAllCrewMember,
  getAllMoviePerson,
  getAllMovieProductionCopany,
  getAllProductionCopany,
};
