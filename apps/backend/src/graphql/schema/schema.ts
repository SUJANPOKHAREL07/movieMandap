import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { movieSocialTypeDef } from './movieSocialSchema';
import { movieTeamTypeDefs } from './movieTeamSchema';
import { userTypeDefs } from './userSchema';
import { dashboardTypeDefs } from './dashboardSchema';
import { routeAccessTypeDefs } from './routeAccessSchema';

export const typeDefs = [
  userTypeDefs,
  LoginTypeDefs,
  movieTypeDefs,
  movieTeamTypeDefs,
  movieSocialTypeDef,
  dashboardTypeDefs,
  routeAccessTypeDefs,
];
