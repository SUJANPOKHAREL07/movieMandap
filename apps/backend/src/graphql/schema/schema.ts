import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { movieSocialTypeDef } from './movieSocialSchema';
import { movieTeamTypeDefs } from './movieTeamSchema';
import { seriesTypeDefs } from './seriesSchema';
import { seriesSocialTypeDef } from './seriesSocialSchema';
import { seriesTeamTypeDefs } from './seriesTeamSchema';
import { seasonTypeDefs } from './seasonSchema';
import { userTypeDefs } from './userSchema';
import { dashboardTypeDefs } from './dashboardSchema';
import { routeAccessTypeDefs } from './routeAccessSchema';

export const typeDefs = [
  userTypeDefs,
  LoginTypeDefs,
  movieTypeDefs,
  movieTeamTypeDefs,
  movieSocialTypeDef,
  seriesTypeDefs,
  seriesTeamTypeDefs,
  seriesSocialTypeDef,
  seasonTypeDefs,
  dashboardTypeDefs,
  routeAccessTypeDefs,
];
