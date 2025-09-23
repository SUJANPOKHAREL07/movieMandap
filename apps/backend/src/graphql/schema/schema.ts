import { LoginTypeDefs } from './loginSchema';
import { movieTypeDefs } from './movieSchema';
import { userTypeDefs } from './userSchema';

export const typeDefs = [userTypeDefs, LoginTypeDefs, movieTypeDefs];
