// import path from 'path';
import { movieModal } from '../modal/movieModal';
import { searchMovieTeam } from '../modal/movieTeamModal';
import {
  TGetMovie,
  TMovieGenre,
  TMovieInput,
  TMovieResponse,
  TMovieUpdate,
} from '../types/movie.types';
import { TResponse } from '../types/user.types';
// import fs from 'fs';
// import { randomUUID } from 'crypto';
const getAllMovie = async (): Promise<TMovieResponse> => {
  const getData: TGetMovie[] = await movieModal.getAllMovie();
  // console.log('get data of the movies', getData);
  if (!getData) {
    return {
      success: true,
      message: 'Failed to get the movie',
      data: [],
    };
  }
  return {
    success: true,
    message: 'All movie',
    data: getData,
  };
};
const createMovie = async (
  data: TMovieInput,
  poster: string
): Promise<TResponse> => {
  try {
    console.log('poster and data', poster, data);

    const createMovie = await movieModal.createMovie(data, poster);

    if (!createMovie) {
      throw new Error('Failed in move creation controller');
    }
    return {
      message: 'Movie created',
      success: false,
    };
  } catch (err) {
    throw new Error('Failed to create the movie');
  }
};
const createGenre = async (name: string) => {
  try {
    const checkExist = await movieModal.checkGenereExist(name);
    if (checkExist !== null) {
      throw new Error('Genere already exist');
    }
    const createGenre = await movieModal.createGenre(name);
    if (!createGenre) {
      return {
        success: false,
        message: 'Failed to create the genre',
      };
    }
    return {
      success: true,
      message: 'Genre created',
    };
  } catch (err) {
    console.log('creaet genere error --', err);
    throw new Error('Unexpected error occur');
  }
};
const getGenre = async () => {
  try {
    const data = await movieModal.getGenre();
    if (!data) {
      return {
        success: false,
        message: 'No Genre found',
      };
    }
    return {
      success: true,
      message: 'All Genre',
      data: data,
    };
  } catch (err) {
    console.log('Failed to get genre', err);
    throw new Error('Failed to get the genre');
  }
};

const createMovieGenre = async ({ movieName, genreName }: TMovieGenre) => {
  try {
    const doesMovieExist = await movieModal.getMovieByName(movieName);
    if (!doesMovieExist) {
      return {
        success: false,
        message: 'No movie found',
      };
    }

    const doesGenreExist = await movieModal.getgnreByName({
      movieName,
      genreName,
    });
    if (doesGenreExist == null) {
      return {
        success: false,
        message: 'No genre found',
      };
    }
    const genreId = Number(
      doesGenreExist.map((m) => {
        return m?.id;
      })
    );
    const data = await movieModal.createMovieGenre(doesMovieExist.id, genreId);
    if (!data) {
      throw new Error('Failed to register the movie genre');
    }
    return {
      success: true,
      message: 'Movie genre register',
    };
  } catch (err) {
    console.log('error in the catch--', err);
    throw new Error('Failed to enter the movie genre');
  }
};
const getAllMovieData = async () => {
  try {
    const data = await movieModal.getAllMovieData();

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No data found',
        data: [],
      };
    }

    return {
      success: true,
      message: 'All movie data',
      data: data,
    };
  } catch (error) {
    console.error('Error in getAllMovieData service:', error);
    return {
      success: false,
      message: 'Error fetching movie data',
      data: [],
    };
  }
};
const updateMovie = async (data: TMovieUpdate, poster: string) => {
  try {
    if (!data) {
      return {
        success: false,
        message: 'Failed: No data provided to update',
        data: data,
      };
    }
    const update = await movieModal.updateMovie(data, poster);
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the movie data',
        data: [],
      };
    }
    return {
      success: true,
      message: 'Movie data updated successfully',
      data: [update],
    };
  } catch (err) {
    return {
      success: false,
      message: err,
      data: [],
    };
  }
};
const deleteMovie = async (moviename: string) => {
  try {
    console.log('Movie data', moviename);
    const searchMovie = await searchMovieTeam.findMovieByName(moviename);
    console.log('Movie data', searchMovie);
    if (!searchMovie) {
      return {
        success: false,
        message: 'Failed :No movie found',
      };
    }
    const deleteData = await movieModal.deleteMovie(moviename);
    if (!deleteData) {
      return {
        success: false,
        message: 'Failed to delete the moive data',
      };
    }
    return {
      success: true,
      message: 'Movie data is deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const movieService = {
  getAllMovie,
  createMovie,
  createGenre,
  getGenre,
  createMovieGenre,
  getAllMovieData,
  updateMovie,
  deleteMovie,
};
