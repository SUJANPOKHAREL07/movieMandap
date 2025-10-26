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

  enum Ratings {
    Worst
    Bearable
    Good_To_Watch
    Worthy
    Absolute_Cinema
  }

  type MovieGenre {
    id: Int
    movieId: Int
    generesId: Int # Fixed typo: gernesId -> generesId
    genre: Genre # Add this to include genre details
  }

  type MovieProductionCompany {
    id: Int
    movieId: Int
    companyId: Int # Fixed typo: conpanyId -> companyId
    company: ProductionCompany # Add this to include company details
  }

  type CrewMember { # Fixed: crewMember -> CrewMember (consistent casing)
    id: Int
    movieId: Int
    personId: Int
    department: String
    job: String
    person: Person # Add this to include person details
  }

  type CastMember {
    id: Int
    movieId: Int
    personId: Int
    character: String
    creditId: String
    person: Person # Add this to include person details
  }
  type ReviewCount {
    Comment: Int
    Like: Int
    Dislike: Int
  }
  type Review {
    id: Int
    title: String
    content: String
    rating: Ratings
    isSpoiler: Boolean
    createdAt: Date # Fixed typo: creadtedAt -> createdAt
    updatedAt: Date
    userId: Int
    movieId: Int
    _count: ReviewCount
    user: User # Add this to include user details
    comments: [Comment] # Add this if you have comments
  }

  type Movie {
    id: Int!
    title: String!
    originalTitle: String
    overview: String
    releaseDate: Date
    runtime: Int!
    posterPath: String
    trailerLink: String
    budget: Int
    revenue: Int
    status: MovieStatus
    tagline: String
    adult: Boolean
    # Change these to arrays to match Prisma response:
    MovieGenre: [MovieGenre] # Array
    MovieProductionCompany: [MovieProductionCompany] # Array
    crewMember: [CrewMember] # Array (note: fixed casing)
    CastMember: [CastMember] # Array
    Review: [Review] # Array
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Genre {
    id: Int!
    name: String!
  }

  type ProductionCompany {
    id: Int!
    name: String!
  }

  type Person {
    id: Int!
    name: String!
    # Add other person fields as needed
  }

  type User {
    id: Int!
    username: String!
    # Add other user fields as needed
  }

  type Comment {
    id: Int!
    content: String!
    # Add other comment fields as needed
  }

  # Remove getMovieData type since we're using Movie type directly
  type Query {
    getMovie: [Movie]
    getGenre: [Genre]
    getAllMovieData: [Movie] # Use Movie type directly
  }

  type Mutation {
    createMovie(
      title: String!
      originalTitle: String
      releaseDate: Date
      runtime: Int!
      poster: Upload
      budget: Int!
      revenue: Int
      status: MovieStatus!
      tagline: String!
      adult: Boolean!
      trailerLink: String
    ): MutationResponse
    updateMovie(
      title: String
      originalTitle: String
      releaseDate: Date
      runtime: Int
      poster: Upload
      budget: Int
      revenue: Int
      status: MovieStatus
      tagline: String
      adult: Boolean
      trailerLink: String
    ): MutationResponse
    createGenre(name: String!): MutationResponse
  }
`;
