import { loginResolver } from './loginResolver';
import { movieResolver } from './movieResolver';
import { movieTeamResolver } from './movieTeamResolver';
import { userResolvers } from './userResolver';

export const resolvers = [
  userResolvers,
  loginResolver,
  movieResolver,
  movieTeamResolver,
];
