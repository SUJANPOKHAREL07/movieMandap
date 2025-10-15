import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { movieTeamTypeDefs } from './movieTeamSchema';
import { userTypeDefs } from './userSchema';

export const typeDefs = [
  userTypeDefs,
  LoginTypeDefs,
  movieTypeDefs,
  movieTeamTypeDefs,
];
