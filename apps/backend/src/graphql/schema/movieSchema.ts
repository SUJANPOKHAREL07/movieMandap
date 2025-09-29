import { gql } from 'apollo-server-express';

export const movieTypeDefs = gql`
  scalar Upload
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
    overview: String
    releaseDate: Date
    runtime: Int!
    posterPath: String
    trailerLink: String!
    budget: Int!
    revenue: Int!
    status: MovieStatus!
    tagline: String!
    adult: Boolean!
  }

  type movieResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getMovie: [Movie]
  }

  type Mutation {
    createMovie(
      title: String!
      originalTitle: String
      releaseDate: Date
      runtime: Int!
      poster: Upload!
      budget: Int!
      revenue: Int
      status: MovieStatus!
      tagline: String!
      adult: Boolean!
      trailerLink: String
    ): movieResponse
  }
`;
