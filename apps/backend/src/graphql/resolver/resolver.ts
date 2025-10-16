import { loginResolver } from './loginResolver';
import { movieResolver } from './movieResolver';
import { movieSocialResolver } from './movieSocialResolver';
import { movieTeamResolver } from './movieTeamResolver';
import { userResolvers } from './userResolver';

export const resolvers = [
  userResolvers,
  loginResolver,
  movieResolver,
  movieTeamResolver,
  movieSocialResolver,
];
