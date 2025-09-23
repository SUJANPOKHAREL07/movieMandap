import { movieModal } from '../modal/movieModal';
import { TMovie, TMovieResponse } from '../types/movie.types';

const getAllMovie = async (): Promise<TMovieResponse> => {
  const getData: TMovie[] = await movieModal.getAllMovie();
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
export const movieService = { getAllMovie };
