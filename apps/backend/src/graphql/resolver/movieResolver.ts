// import Upload from 'graphql-upload/Upload.mjs';
import { movieService } from '../../service/movieService';
// import { TMovieInput } from '../../types/movie.types';
// import { TReqRes } from '../../types/user.types';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { uploadFile } from '../../utils/uploadHandling';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
export const movieResolver = {
  Upload: GraphQLUpload,
  Query: {
    getMovie: movieService.getAllMovie(),
  },
  Mutation: {
    createMovie: async (_: any, args: any, context: any) => {
      const auth = await authContextMiddleware(context);
      console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userRole = auth.user?.role;
      if (userRole === 'user') {
        return {
          success: false,
          message: 'User are not allowed to create',
        };
      }
      const { poster, ...data } = args;
      const posterPath = await uploadFile(poster);
      return await movieService.createMovie(data, posterPath);
    },
  },
};
