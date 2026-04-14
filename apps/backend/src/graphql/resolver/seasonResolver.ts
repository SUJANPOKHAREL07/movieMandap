import { seasonService } from '../../service/seasonService';

export const seasonResolver = {
    Query: {
        getSeasonsOfSeries: async (_: any, args: { seriesId: number }) => {
            return seasonService.getSeasonsOfSeries(args.seriesId);
        },
        getAllReviewsOfSeason: async (_: any, args: { seasonId: number }, context: any) => {
            const userId = context?.user?.id;
            return seasonService.getAllReviewsOfSeason(args.seasonId, userId);
        },
    },
    Mutation: {
        addSeason: async (_: any, args: any) => {
            return seasonService.addSeason(args);
        },
        updateSeason: async (_: any, args: any) => {
            const { id, ...rest } = args;
            return seasonService.updateSeason(id, rest);
        },
        deleteSeason: async (_: any, args: { id: number }) => {
            return seasonService.deleteSeason(args.id);
        },
        createSeasonReview: async (_: any, args: any, context: any) => {
            if (!context?.user?.id) return { success: false, message: 'Not authenticated.' };
            const { seasonId, title, content, rating, isSpoiler } = args;
            return seasonService.createSeasonReview(context.user.id, { seasonId, title, content, rating, isSpoiler });
        },
        updateSeasonReview: async (_: any, args: any, context: any) => {
            if (!context?.user?.id) return { success: false, message: 'Not authenticated.' };
            const { reviewId, ...rest } = args;
            return seasonService.updateSeasonReview(context.user.id, reviewId, rest);
        },
        deleteSeasonReview: async (_: any, args: { reviewId: number }, context: any) => {
            if (!context?.user?.id) return { success: false, message: 'Not authenticated.' };
            return seasonService.deleteSeasonReview(context.user.id, args.reviewId);
        },
        toggleSeasonReviewLike: async (_: any, args: { reviewId: number }, context: any) => {
            if (!context?.user?.id) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonReviewLike(context.user.id, args.reviewId);
        },
        toggleSeasonReviewDislike: async (_: any, args: { reviewId: number }, context: any) => {
            if (!context?.user?.id) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonReviewDislike(context.user.id, args.reviewId);
        },
    },
};
