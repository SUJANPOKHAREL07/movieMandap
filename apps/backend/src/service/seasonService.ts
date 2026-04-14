import { PrismaClient } from '@prisma/client';
import { uploadBase64 } from '../utils/cloudnary';

const prisma = new PrismaClient();

export const seasonService = {
    async getSeasonsOfSeries(seriesId: number) {
        return prisma.season.findMany({
            where: { seriesId },
            orderBy: { seasonNumber: 'asc' },
            include: { SeasonReview: true },
        });
    },

    async getAllReviewsOfSeason(seasonId: number, userId?: number) {
        const reviews = await (prisma as any).seasonReview.findMany({
            where: { seasonId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true } },
                _count: { select: { SeasonLike: true, SeasonDislike: true, SeasonComment: true } },
                ...(userId ? {
                    SeasonLike: { where: { userId } },
                    SeasonDislike: { where: { userId } },
                } : {}),
            },
        });
        return reviews.map((r: any) => ({
            ...r,
            likesCount: r._count.SeasonLike,
            disLikesCount: r._count.SeasonDislike,
            commentsCount: r._count.SeasonComment,
            userHasLiked: (r.SeasonLike?.length ?? 0) > 0,
            userHasDisliked: (r.SeasonDislike?.length ?? 0) > 0,
        }));
    },

    async addSeason(data: {
        seriesId: number;
        seasonNumber: number;
        title?: string;
        overview?: string;
        airDate?: string;
        episodeCount?: number;
        posterBase64?: string;
    }) {
        let posterPath: string | undefined;
        if (data.posterBase64) {
            posterPath = await uploadBase64(data.posterBase64);
        }
        const season = await prisma.season.create({
            data: {
                seriesId: data.seriesId,
                seasonNumber: data.seasonNumber,
                title: data.title,
                overview: data.overview,
                airDate: data.airDate ? new Date(data.airDate) : undefined,
                episodeCount: data.episodeCount ?? 0,
                posterPath,
            },
        });
        return { success: true, message: `Season ${season.seasonNumber} added.` };
    },

    async updateSeason(id: number, data: any) {
        let posterPath: string | undefined;
        if (data.posterBase64) {
            posterPath = await uploadBase64(data.posterBase64);
        }
        await prisma.season.update({
            where: { id },
            data: {
                title: data.title,
                overview: data.overview,
                airDate: data.airDate ? new Date(data.airDate) : undefined,
                episodeCount: data.episodeCount,
                ...(posterPath ? { posterPath } : {}),
            },
        });
        return { success: true, message: 'Season updated.' };
    },

    async deleteSeason(id: number) {
        await (prisma as any).season.delete({ where: { id } });
        return { success: true, message: 'Season deleted.' };
    },

    async createSeasonReview(userId: number, data: { seasonId: number; title: string; content: string; rating: string; isSpoiler: boolean }) {
        const existing = await (prisma as any).seasonReview.findUnique({ where: { userId_seasonId: { userId, seasonId: data.seasonId } } });
        if (existing) return { success: false, message: 'You have already reviewed this season.' };
        await (prisma as any).seasonReview.create({ data: { userId, ...data, rating: data.rating as any } });
        return { success: true, message: 'Season review created.' };
    },

    async updateSeasonReview(userId: number, reviewId: number, data: any) {
        const review = await (prisma as any).seasonReview.findUnique({ where: { id: reviewId } });
        if (!review || review.userId !== userId) return { success: false, message: 'Not authorized.' };
        await (prisma as any).seasonReview.update({ where: { id: reviewId }, data });
        return { success: true, message: 'Season review updated.' };
    },

    async deleteSeasonReview(userId: number, reviewId: number) {
        const review = await (prisma as any).seasonReview.findUnique({ where: { id: reviewId } });
        if (!review || review.userId !== userId) return { success: false, message: 'Not authorized.' };
        await (prisma as any).seasonReview.delete({ where: { id: reviewId } });
        return { success: true, message: 'Season review deleted.' };
    },

    async toggleSeasonReviewLike(userId: number, reviewId: number) {
        const existing = await (prisma as any).seasonLike.findUnique({ where: { userId_reviewId: { userId, reviewId } } });
        if (existing) {
            await (prisma as any).seasonLike.delete({ where: { userId_reviewId: { userId, reviewId } } });
            return { success: true, message: 'Like removed.' };
        }
        await (prisma as any).seasonLike.create({ data: { userId, reviewId } });
        return { success: true, message: 'Liked.' };
    },

    async toggleSeasonReviewDislike(userId: number, reviewId: number) {
        const existing = await (prisma as any).seasonDislike.findUnique({ where: { userId_reviewId: { userId, reviewId } } });
        if (existing) {
            await (prisma as any).seasonDislike.delete({ where: { userId_reviewId: { userId, reviewId } } });
            return { success: true, message: 'Dislike removed.' };
        }
        await (prisma as any).seasonDislike.create({ data: { userId, reviewId } });
        return { success: true, message: 'Disliked.' };
    },
};
