// import Upload from 'graphql-upload/Upload.mjs';
import { seriesService } from '../../service/seriesService';
// import { TSeriesInput } from '../../types/series.types';
// import { TReqRes } from '../../types/user.types';
import { GraphQLUpload } from 'graphql-upload';
import { uploadBase64 } from '../../utils/cloudnary';
import { authContextMiddleware } from '../../authMiddleware/authMiddleware';
import { TSeriesInput } from '../../types/series.types';
export const seriesResolver = {
  Upload: GraphQLUpload,
  Query: {
    getSeries: async () => {
      const data = await seriesService.getAllSeries();
      console.log('resolver data of the seriess', data.data);
      return data.data;
    },
    __removed_getGenre: async () => {
      const data = await seriesService.getGenre();
      return data.data;
    },
    getAllSeriesData: async () => {
      const res = await seriesService.getAllSeriesData();
      console.log(
        'service response for getAllSeriesData ---',
        JSON.stringify(res, null, 2)
      );

      const seriess = Array.isArray(res?.data) ? res.data : res?.data ?? [];
      console.log('normalized seriess array length ->', seriess?.length);

      return seriess;
    },
  },
  Mutation: {
    createSeries: async (_: any, args: TSeriesInput, context: any) => {
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
      const { posterBase64, ...data } = args as any;
      let posterPath = '';
      if (posterBase64) {
        posterPath = await uploadBase64(posterBase64);
      }
      return await seriesService.createSeries(data, posterPath);
    },
    updateSeries: async (_: any, args: TSeriesInput, context: any) => {
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
      const { posterBase64, ...data } = args as any;
      let posterPath = '';
      if (posterBase64) {
        posterPath = await uploadBase64(posterBase64);
      }
      return await seriesService.updateSeries(data, posterPath);
    },
    deleteSeries: async (_: any, { title }: any, context: any) => {
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
      return await seriesService.deleteSeries(title);
    },

    __removed_createGenre: async (_: any, { name }: any, context: any) => {
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
      return await seriesService.createGenre(name);
    },
  },
  Series: {
    voteAverage: (parent: any) => {
      if (!parent.SeriesReview || parent.SeriesReview.length === 0) return 0;
      const total = parent.SeriesReview.reduce((acc: number, seriesReview: any) => {
        let ratingValue = 0;
        switch (seriesReview.rating) {
          case 'Worst':
            ratingValue = 1;
            break;
          case 'Bearable':
            ratingValue = 2;
            break;
          case 'Good_To_Watch':
            ratingValue = 3;
            break;
          case 'Worthy':
            ratingValue = 4;
            break;
          case 'Absolute_Cinema':
            ratingValue = 5;
            break;
          default:
            ratingValue = 0;
        }
        return acc + ratingValue;
      }, 0);
      return Number((total / parent.SeriesReview.length).toFixed(1));
    },
    dominantRating: (parent: any) => {
      if (!parent.SeriesReview || parent.SeriesReview.length === 0) return 'No Ratings';
      const counts: Record<string, number> = {};
      parent.SeriesReview.forEach((review: any) => {
        counts[review.rating] = (counts[review.rating] || 0) + 1;
      });

      let maxCount = 0;
      let dominant = '';

      // Define order of ratings if ties occur, or just pick the first one
      // But typically, we just pick the one with the highest count.
      for (const rating in counts) {
        if (counts[rating] > maxCount) {
          maxCount = counts[rating];
          dominant = rating;
        }
      }

      // Replace underscores with spaces for better display
      return dominant.replace(/_/g, ' ');
    },
  },
};
