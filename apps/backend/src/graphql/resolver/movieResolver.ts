// import Upload from 'graphql-upload/Upload.mjs';
import { movieService } from '../../service/movieService';
// import { TMovieInput } from '../../types/movie.types';
// import { TReqRes } from '../../types/user.types';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { uploadFile } from '../../utils/uploadHandling';
export const movieResolver = {
  Upload: GraphQLUpload,
  Query: {
    getMovie: movieService.getAllMovie(),
  },
  Mutation: {
    createMovie: async (_: any, args: any, { req, res }: any) => {
      const { poster, ...data } = args;
      const posterPath = await uploadFile(poster);
      console.log('posteer path::', posterPath);
      return await movieService.createMovie(data, posterPath);
    },
  },
};
