// import path from 'path';
import { movieModal } from '../modal/movieModal';
import { TGetMovie, TMovieResponse } from '../types/movie.types';
// import fs from 'fs';
// import { randomUUID } from 'crypto';
const getAllMovie = async (): Promise<TMovieResponse> => {
  const getData: TGetMovie[] = await movieModal.getAllMovie();
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
const createMovie = async (data: any, poster: string) => {
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
export const movieService = { getAllMovie, createMovie };
