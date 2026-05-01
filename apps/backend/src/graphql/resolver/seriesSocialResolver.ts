import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import {
  seriesSocialCreate,
  SeriesSocialDelete,
  SeriesSocialGet,
  SeriesSocialUpdate,
} from '../../service/seriesSocialService';

export const seriesSocialResolver = {
  Query: {
    getAllReviewOfSeries: async (_: any, { seriesName }: any, context: any) => {
      console.log('Series name in resolver', seriesName);

      if (typeof seriesName !== 'string') {
        throw new Error('Series name must be string');
      }

      // Allow public access to reviews
      const auth = await authContextMiddleware(context).catch(() => ({ user: null }));
      const data = await SeriesSocialGet.getAllReviewOfSeries(seriesName);

      if (!data.success) {
        throw new Error(data.message);
      }
      if (typeof data.data == 'undefined') {
        throw new Error(data.message);
      }

      const userId = Number(auth.user?.userId || 0);

      const transformedReviews = data.data.map((review: any) => {
        // Function to transform comments recursively
        const transformComment = (comment: any): any => ({
          id: comment.id,
          content: comment.content,
          parentId: comment.parentId,
          user: comment.user,
          createdAt: String(comment.createdAt.getTime()),
          updatedAt: String(comment.updatedAt.getTime()),
          likesCount: comment._count?.SeriesCommentLike || 0,
          disLikesCount: comment._count?.SeriesCommentDislike || 0,
          userHasLiked: userId ? comment.SeriesCommentLike?.some((l: any) => l.userId === userId) : false,
          userHasDisliked: userId ? comment.SeriesCommentDislike?.some((d: any) => d.userId === userId) : false,
          replies: comment.replies ? comment.replies.map(transformComment) : [],
        });

        return {
          id: review.id,
          title: review.title,
          content: review.content,
          rating: review.rating,
          isSpoiler: review.isSpoiler,
          user: review.user,
          comments: review.SeriesComment ? review.SeriesComment.map(transformComment) : [],
          likesCount: review._count?.SeriesLike || 0,
          disLikesCount: review._count?.SeriesDislike || 0,
          commentsCount: review._count?.SeriesComment || 0,
          userHasLiked: userId ? review.SeriesLike?.some((l: any) => l.userId === userId) : false,
          userHasDisliked: userId ? review.SeriesDislike?.some((d: any) => d.userId === userId) : false,
          createdAt: String(review.creadtedAt.getTime()),
          updatedAt: String(review.updatedAt.getTime()),
        };
      });

      console.log('data of review in the resolver', JSON.stringify(transformedReviews, null, 2));
      return transformedReviews;
    },
    getAllSeriesWatchList: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await SeriesSocialGet.getAllWatchList(userId);
      if (data.success !== true) {
        throw new Error(data.message);
      }

      console.log('data in the resolver', data.data);
      const watchData = data.data;
      console.log('watch data ----', watchData);

      return watchData;
    },
    __removed_getFollowing: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await SeriesSocialGet.getFollowing(userId);
      return data.data;
    },
    __removed_getFollower: async (_: any, __: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      const data = await SeriesSocialGet.getFollower(userId);
      return data.data;
    },
  },
  Mutation: {
    createSeriesReview: async (
      _: any,
      { title, content, isSpoiler, rating, seriesName }: any,
      context: any
    ) => {
      if (
        (typeof title ||
          typeof content ||
          typeof isSpoiler ||
          typeof rating ||
          seriesName) !== 'string'
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
      return await seriesSocialCreate.createReview(
        title,
        content,
        isSpoiler,
        rating,
        seriesName,
        userId
      );
    },
    createSeriesComment: async (_: any, { content, reviewId, parentId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) throw new Error('Token missing in header');

      const userId = Number(auth.user?.userId);
      return await seriesSocialCreate.createComment({
        content,
        reviewId,
        userId,
        parentId,
      });
    },
    deleteSeriesReview: async (_: any, { reviewId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      if (typeof reviewId !== 'number') {
        return {
          success: false,
          message: 'Id must be number',
        };
      }
      const userId = Number(auth.user?.userId);
      return await SeriesSocialDelete.deleteReview(reviewId, userId);
    },
    updateSeriesReview: async (
      _: any,
      { reviewId, title, content, rating, isSpoiler }: any,
      context: any
    ) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userId = Number(auth.user?.userId);
      return await SeriesSocialUpdate.updateReview(
        userId,
        reviewId,
        title,
        content,
        rating,
        isSpoiler
      );
    },
    updateSeriesComment: async (_: any, { commentId, content }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) return { success: false, message: 'Token missing in header' };
      const userId = Number(auth.user?.userId);
      return await SeriesSocialUpdate.updateComment(userId, commentId, content);
    },
    deleteSeriesComment: async (_: any, { commentId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) return { success: false, message: 'Token missing in header' };
      const userId = Number(auth.user?.userId);
      return await SeriesSocialDelete.deleteComment(userId, commentId);
    },
    createSeriesWatchList: async (_: any, { seriesName, note }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      //   console.log('auth ', auth);
      if (auth.token === null) {
        return {
          success: false,
          message: 'Token missing in header',
        };
      }
      const userId = Number(auth.user?.userId);
      return await seriesSocialCreate.createWatchList(seriesName, userId, note);
    },
    updateSeriesWatchListStatus: async (_: any, { seriesName }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }
      const userId = Number(auth.user?.userId);
      return await SeriesSocialUpdate.updateSeriesWatchList(seriesName, userId);
    },
    createSeriesLike: async (_: any, { reviewId }: any, context: any) => {
      if (typeof reviewId !== 'number') {
        throw new Error('SeriesReview Id Type must be number');
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
      return await seriesSocialCreate.createLike(data);
    },
    deleteSeriesLike: async (_: any, { likeId }: any, context: any) => {
      if (typeof likeId !== 'number') {
        throw new Error('SeriesReview Id Type must be number');
      }
      console.log('context data--->', context);
      const auth = await authContextMiddleware(context);
      console.log('auth token--', auth);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }

      return await SeriesSocialDelete.deleteLike(likeId);
    },
    createSeriesDislike: async (_: any, { reviewId }: any, context: any) => {
      if (typeof reviewId !== 'number') {
        throw new Error('SeriesReview Id Type must be number');
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
      return await seriesSocialCreate.createDisLike(data);
    },
    deleteSeriesDislike: async (_: any, { disLikeId }: any, context: any) => {
      if (typeof disLikeId !== 'number') {
        throw new Error('dislike Id Type must be number');
      }
      const auth = await authContextMiddleware(context);
      if (auth.token === null) {
        throw new Error('Token missing in header');
      }

      return await SeriesSocialDelete.deleteDisLike(disLikeId);
    },
    toggleSeriesReviewLike: async (_: any, { reviewId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) throw new Error('Token missing in header');
      return await seriesSocialCreate.toggleReviewLike(Number(auth.user?.userId), reviewId);
    },
    toggleSeriesReviewDislike: async (_: any, { reviewId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) throw new Error('Token missing in header');
      return await seriesSocialCreate.toggleReviewDislike(Number(auth.user?.userId), reviewId);
    },
    toggleSeriesCommentLike: async (_: any, { commentId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) throw new Error('Token missing in header');
      return await seriesSocialCreate.toggleCommentLike(Number(auth.user?.userId), commentId);
    },
    toggleSeriesCommentDislike: async (_: any, { commentId }: any, context: any) => {
      const auth = await authContextMiddleware(context);
      if (auth.token === null) throw new Error('Token missing in header');
      return await seriesSocialCreate.toggleCommentDislike(Number(auth.user?.userId), commentId);
    },
    __removed_createFollow: async (_: any, { toFollowId }: any, context: any) => {
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
      return await seriesSocialCreate.createFollow(userId, toFollowId);
    },
    __removed_unFollow: async (_: any, { notToFollowId }: any, context: any) => {
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
      return await SeriesSocialDelete.deleteFollowData(userId, notToFollowId);
    },
  },
};
