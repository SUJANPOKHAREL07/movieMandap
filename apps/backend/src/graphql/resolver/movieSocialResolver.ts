import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import {
  movieSocialCreate,
  MovieSocialDelete,
  MovieSocialGet,
  MovieSocialUpdate,
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
        likesCount: review._count?.Like || 0,
        disLikesCount: review._count?.Dislike || 0,

        commentsCount: review._count?.Comment || 0,
        creadtedAt: review.creadtedAt,
      }));
      console.log('data of review in the resolver', transformedReviews);
      return transformedReviews;
    },
    getAllWatchList: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await MovieSocialGet.getAllWatchList(userId);
      if (data.success !== true) {
        throw new Error(data.message);
      }

      console.log('data in the resolver', data.data);
      const watchData = data.data;
      console.log('watch data ----', watchData);

      return watchData;
    },
    getFollowing: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await MovieSocialGet.getFollowing(userId);
      return data.data;
    },
    getFollower: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await MovieSocialGet.getFollower(userId);
      return data.data;
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
    createWatchList: async (_: any, { movieName, note }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      //   console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userId = Number(auth.user?.userId);
      return await movieSocialCreate.createWatchList(movieName, userId, note);
    },
    updateWatchListStatus: async (_: any, { movieName }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      return await MovieSocialUpdate.updateMovieWatchList(movieName, userId);
    },
    createLike: async (_: any, { reviewId }: any, context: any) => {
      if (typeof reviewId !== 'number') {
        throw new Error('Review Id Type must be number');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = {
        reviewId,
        userId,
      };
      return await movieSocialCreate.createLike(data);
    },
    deleteLike: async (_: any, { likeId }: any, context: any) => {
      if (typeof likeId !== 'number') {
        throw new Error('Review Id Type must be number');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }

      return await MovieSocialDelete.deleteLike(likeId);
    },
    createDisLike: async (_: any, { reviewId }: any, context: any) => {
      if (typeof reviewId !== 'number') {
        throw new Error('Review Id Type must be number');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = {
        reviewId,
        userId,
      };
      return await movieSocialCreate.createDisLike(data);
    },
    deleteDisLike: async (_: any, { disLikeId }: any, context: any) => {
      if (typeof disLikeId !== 'number') {
        throw new Error('dislike Id Type must be number');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }

      return await MovieSocialDelete.deleteDisLike(disLikeId);
    },
    createFollow: async (_: any, { toFollowId }: any, context: any) => {
      console.log('this user get new follwer', toFollowId);
      if (typeof toFollowId !== 'number') {
        throw new Error('Id must be number----');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      console.log(userId);
      return await movieSocialCreate.createFollow(userId, toFollowId);
    },
    unFollow: async (_: any, { notToFollowId }: any, context: any) => {
      console.log('this user will loose one follower', notToFollowId);
      if (typeof notToFollowId !== 'number') {
        throw new Error('Id must be number----');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      console.log(userId);
      return await MovieSocialDelete.deleteFollowData(userId, notToFollowId);
    },
  },
};
