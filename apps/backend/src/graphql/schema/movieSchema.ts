import { gql } from 'apollo-server-express';

export const movieTypeDefs = gql`
  scalar Date
  enum MovieStatus {
    RELEASED
    IN_PRODUCTION
    POST_PRODUCTION
    PLANNED
    CANCELLED
    RUMORED
  }
  type Movie {
    id: String!
    title: String!
    originalTitle: String
    releaseDate: Date
    runTime: Int!
    posterPath: String!
    budget: Int!
    revenue: Int
    status: MovieStatus!
    tagline: String!
    adutl: Boolean!
  }
  type movieResponse {
    success: Boolean!
    message: String!
  }
  type Query {
    getMovie: [Movie!]!
  }
  type Mutation {
    createMovive(
      title: String!
      originalTitle: String
      releaseDate: Date
      runtime: Int!
      posterPath: String!
      budget: Int!
      revenue: Int
      status: MovieStatus!
      tagline: String!
      adutl: Boolean!
    ): movieResponse
  }
`;
