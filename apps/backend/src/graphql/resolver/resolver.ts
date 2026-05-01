import { loginResolver } from './loginResolver';
import { movieResolver } from './movieResolver';
import { movieSocialResolver } from './movieSocialResolver';
import { movieTeamResolver } from './movieTeamResolver';
import { seriesResolver } from './seriesResolver';
import { seriesSocialResolver } from './seriesSocialResolver';
import { seriesTeamResolver } from './seriesTeamResolver';
import { seasonResolver } from './seasonResolver';
import { userResolvers } from './userResolver';
import { dashboardResolver } from './dashboardResolver';
import { routeAccessResolver } from './routeAccessResolver';
import { episodeResolver } from './episodeResolver';

export const resolvers = [
  userResolvers,
  loginResolver,
  movieResolver,
  movieTeamResolver,
  movieSocialResolver,
  seriesResolver,
  seriesTeamResolver,
  seriesSocialResolver,
  seasonResolver,
  dashboardResolver,
  routeAccessResolver,
  episodeResolver,
];
