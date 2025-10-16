import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import {
  movieSocialCreate,
  MovieSocialGet,
} from '../../service/movieSocialService';

export const movieSocialResolver = {
  Query: {
    getAllReviewOfMovie: async (_: any, { movieName }: any, context: any) => {
      console.log('Movie name in resolver', movieName);

      if (typeof movieName !== 'string') {
        throw new Error('Movie name must be string');
      }

      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }

      const data = await MovieSocialGet.getAllReviewOfMovie(movieName);

      if (!data.success) {
        throw new Error(data.message);
      }
      if (typeof data.data == 'undefined') {
        throw new Error(data.message);
      }
      // Transform the data to match our schema
      const transformedReviews = data.data.map((review: any) => ({
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating,
        isSpoiler: review.isSpoiler,
        user: review.user, // This should now be populated
        comments: review.Comment
          ? review.Comment.map((comment: any) => ({
              id: comment.id,
              content: comment.content,
              user: comment.user,
              replies: comment.replies || [],
            }))
          : [],
        likesCount: review._count?.likes || 0,
        commentsCount: review._count?.Comment || 0,
        creadtedAt: review.creadtedAt,
      }));

      return transformedReviews;
    },
  },
  Mutation: {
    createReview: async (
      _: any,
      { title, content, isSpoiler, rating, movieName }: any,
      context: any
    ) => {
      if (
        (typeof title ||
          typeof content ||
          typeof isSpoiler ||
          typeof rating ||
          movieName) !== 'string'
      ) {
        return {
          success: false,
          message: 'Data must be in string ',
        };
      }
      const auth = await authContextMiddleware(context);
      //   console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userRole = auth.user?.role;
      console.log('logged in user role ', userRole);

      const userId = Number(auth.user?.userId);
      return await movieSocialCreate.createReview(
        title,
        content,
        isSpoiler,
        rating,
        movieName,
        userId
      );
    },
  },
};
