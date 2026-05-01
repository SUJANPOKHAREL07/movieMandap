import { episodeService } from '../../service/episodeService';

export const episodeResolver = {
    Query: {
        getEpisodesOfSeason: async (_: any, args: { seasonId: number }) => {
            return episodeService.getEpisodesOfSeason(args.seasonId);
        },
    },
    Mutation: {
        addEpisode: async (_: any, args: any) => {
            return episodeService.addEpisode(args);
        },
        updateEpisode: async (_: any, args: { id: number;[key: string]: any }) => {
            const { id, ...rest } = args;
            return episodeService.updateEpisode(id, rest);
        },
        deleteEpisode: async (_: any, args: { id: number }) => {
            return episodeService.deleteEpisode(args.id);
        },
    },
};
