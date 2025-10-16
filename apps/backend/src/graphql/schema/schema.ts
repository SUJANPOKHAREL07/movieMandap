import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { movieSocialTypeDef } from './movieSocialSchema';
import { movieTeamTypeDefs } from './movieTeamSchema';
import { userTypeDefs } from './userSchema';

export const typeDefs = [
  userTypeDefs,
  LoginTypeDefs,
  movieTypeDefs,
  movieTeamTypeDefs,
  movieSocialTypeDef,
];
