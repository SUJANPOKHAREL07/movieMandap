import { PrismaClient } from '@prisma/client';
import { uploadBase64 } from '../utils/cloudnary';

const prisma = new PrismaClient();

export const episodeService = {
    getEpisodesOfSeason: async (seasonId: number) => {
        return prisma.episode.findMany({
            where: { seasonId },
            orderBy: { episodeNumber: 'asc' },
        });
    },

    addEpisode: async (data: any) => {
        const existing = await prisma.episode.findFirst({
            where: { seasonId: data.seasonId, episodeNumber: data.episodeNumber }
        });
        if (existing) {
            return { success: false, message: `Episode ${data.episodeNumber} already exists in this season.` };
        }

        let posterPath: string | undefined;
        if (data.posterBase64) {
            posterPath = await uploadBase64(data.posterBase64);
        }
        const episode = await prisma.episode.create({
            data: {
                seasonId: data.seasonId,
                episodeNumber: data.episodeNumber,
                title: data.title,
                overview: data.overview,
                airDate: data.airDate ? new Date(data.airDate) : undefined,
                runtime: data.runtime,
                posterPath,
            },
        });

        // Auto-update episode count
        const count = await prisma.episode.count({ where: { seasonId: data.seasonId } });
        await prisma.season.update({ where: { id: data.seasonId }, data: { episodeCount: count } });

        return { success: true, message: 'Episode added', episode };
    },

    updateEpisode: async (id: number, data: any) => {
        let posterPath: string | undefined;
        if (data.posterBase64) {
            posterPath = await uploadBase64(data.posterBase64);
        }

        const episode = await prisma.episode.update({
            where: { id },
            data: {
                ...(data.episodeNumber !== undefined ? { episodeNumber: data.episodeNumber } : {}),
                title: data.title,
                overview: data.overview,
                airDate: data.airDate ? new Date(data.airDate) : undefined,
                runtime: data.runtime,
                ...(posterPath ? { posterPath } : {}),
            },
        });
        return { success: true, message: 'Episode updated', episode };
    },

    deleteEpisode: async (id: number) => {
        const ep = await prisma.episode.delete({ where: { id } });
        if (ep) {
            const count = await prisma.episode.count({ where: { seasonId: ep.seasonId } });
            await prisma.season.update({ where: { id: ep.seasonId }, data: { episodeCount: count } });
        }
        return { success: true, message: 'Episode deleted' };
    },
};
