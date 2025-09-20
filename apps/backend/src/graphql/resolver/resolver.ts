import { loginResolver } from './loginResolver';
import { userResolvers } from './userResolver';

export const resolvers = [userResolvers, loginResolver];
