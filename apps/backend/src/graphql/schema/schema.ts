import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { movieSocialTypeDef } from './movieSocialSchema';
import { movieTeamTypeDefs } from './movieTeamSchema';
import { userTypeDefs } from './userSchema';
import { dashboardTypeDefs } from './dashboardSchema';

export const typeDefs = [
  userTypeDefs,
  LoginTypeDefs,
  movieTypeDefs,
  movieTeamTypeDefs,
  movieSocialTypeDef,
  dashboardTypeDefs,
];
