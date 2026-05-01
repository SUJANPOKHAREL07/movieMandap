import { seasonService } from '../../service/seasonService';

// main.ts globally runs authContextMiddleware and injects { user, token } into context.
// context.user has shape: { userId: number, role: string }
// So we read context.user.userId and context.token directly here.

const getAuthUserId = (context: any): number | null => {
    if (!context?.token || !context?.user?.userId) return null;
    return Number(context.user.userId);
};

export const seasonResolver = {
    Query: {
        getSeasonsOfSeries: async (_: any, args: { seriesId: number }) => {
            return seasonService.getSeasonsOfSeries(args.seriesId);
        },
        getAllReviewsOfSeason: async (_: any, args: { seasonId: number }, context: any) => {
            const userId = getAuthUserId(context) ?? undefined;
            const data = await seasonService.getAllReviewsOfSeason(args.seasonId, userId);

            const transformComment = (comment: any): any => ({
                id: comment.id,
                content: comment.content,
                parentId: comment.parentId,
                user: comment.user,
                createdAt: String(new Date(comment.createdAt).getTime()),
                updatedAt: String(new Date(comment.updatedAt).getTime()),
                likesCount: comment._count?.SeasonCommentLike || 0,
                disLikesCount: comment._count?.SeasonCommentDislike || 0,
                userHasLiked: userId ? comment.SeasonCommentLike?.some((l: any) => l.userId === userId) : false,
                userHasDisliked: userId ? comment.SeasonCommentDislike?.some((d: any) => d.userId === userId) : false,
                replies: comment.replies ? comment.replies.map(transformComment) : [],
            });

            return data.map((review: any) => ({
                ...review,
                comments: review.SeasonComment ? review.SeasonComment.map(transformComment) : [],
                createdAt: String(new Date(review.createdAt).getTime()),
                updatedAt: String(new Date(review.updatedAt).getTime()),
            }));
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
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            const { seasonId, title, content, rating, isSpoiler } = args;
            return seasonService.createSeasonReview(userId, { seasonId, title, content, rating, isSpoiler });
        },
        updateSeasonReview: async (_: any, args: any, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            const { reviewId, ...rest } = args;
            return seasonService.updateSeasonReview(userId, reviewId, rest);
        },
        deleteSeasonReview: async (_: any, args: { reviewId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.deleteSeasonReview(userId, args.reviewId);
        },
        toggleSeasonReviewLike: async (_: any, args: { reviewId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonReviewLike(userId, args.reviewId);
        },
        toggleSeasonReviewDislike: async (_: any, args: { reviewId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonReviewDislike(userId, args.reviewId);
        },
        createSeasonComment: async (_: any, args: any, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.createSeasonComment(userId, args);
        },
        updateSeasonComment: async (_: any, args: { commentId: number, content: string }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.updateSeasonComment(userId, args.commentId, args.content);
        },
        deleteSeasonComment: async (_: any, args: { commentId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.deleteSeasonComment(userId, args.commentId);
        },
        toggleSeasonCommentLike: async (_: any, args: { commentId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonCommentLike(userId, args.commentId);
        },
        toggleSeasonCommentDislike: async (_: any, args: { commentId: number }, context: any) => {
            const userId = getAuthUserId(context);
            if (!userId) return { success: false, message: 'Not authenticated.' };
            return seasonService.toggleSeasonCommentDislike(userId, args.commentId);
        },
    },
};
