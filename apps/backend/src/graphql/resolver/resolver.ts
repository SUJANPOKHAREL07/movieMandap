import { loginResolver } from './loginResolver';
import { movieResolver } from './movieResolver';
import { userResolvers } from './userResolver';

export const resolvers = [userResolvers, loginResolver, movieResolver];
