import { movieService } from '../../service/movieService';

export const movieResolver = {
  Query: {
    getMovie: movieService.getAllMovie(),
  },
};
