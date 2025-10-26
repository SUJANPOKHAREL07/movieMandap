// import Upload from 'graphql-upload/Upload.mjs';
import { movieService } from '../../service/movieService';
// import { TMovieInput } from '../../types/movie.types';
// import { TReqRes } from '../../types/user.types';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { uploadFile } from '../../utils/uploadHandling';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { TMovieInput } from '../../types/movie.types';
export const movieResolver = {
  Upload: GraphQLUpload,
  Query: {
    getMovie: async () => {
      const data = await movieService.getAllMovie();
      console.log('resolver data of the movies', data.data);
      return data.data;
    },
    getGenre: async () => {
      const data = await movieService.getGenre();
      return data.data;
    },
    getAllMovieData: async () => {
      const res = await movieService.getAllMovieData();
      console.log(
        'service response for getAllMovieData ---',
        JSON.stringify(res, null, 2)
      );

      const movies = Array.isArray(res?.data) ? res.data : res?.data ?? [];
      console.log('normalized movies array length ->', movies?.length);

      return movies;
    },
  },
  Mutation: {
    createMovie: async (_: any, args: TMovieInput, context: any) => {
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
      let posterPath = '';
      if (typeof poster !== 'undefined') {
        posterPath = await uploadFile(poster);
      }
      return await movieService.createMovie(data, posterPath);
    },
    updateMovie: async (_: any, args: TMovieInput, context: any) => {
      // console.log('context data----', context);
      const auth = await authContextMiddleware(context);
      // console.log('auth ', auth);
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
      let posterPath = '';
      if (typeof poster !== 'undefined') {
        posterPath = await uploadFile(poster);
      }
      return await movieService.updateMovie(data, posterPath);
    },
    deleteMovie: async (_: any, { title }: any, context: any) => {
      if (typeof title !== 'string') {
        throw new Error('Title must be string');
      }
      const auth = await authContextMiddleware(context);
      // console.log('auth ', auth);
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
          message: 'User are not allowed to delete',
        };
      }
      return await movieService.deleteMovie(title);
    },

    createGenre: async (_: any, { name }: any, context: any) => {
      if (typeof name !== 'string') return 'Name must be string';
      console.log('token to create the genre---', context.token);
      const auth = await authContextMiddleware(context);
      // console.log('auth ', auth);
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
      return await movieService.createGenre(name);
    },
  },
};
