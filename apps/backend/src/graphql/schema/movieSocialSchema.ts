import { gql } from 'apollo-server-express';

export const movieSocialTypeDef = gql`
  scalar Date
  enum Ratings {
    Worst
    Bearable
    Good_To_Watch
    Worthy
    Absolute_Cinema
  }

  type Comment {
    id: Int!
    content: String!
    user: User!
    replies: [Comment]
  }

  type User {
    id: Int!
    username: String!
  }

  type Review {
    id: Int!
    title: String!
    content: String!
    rating: Ratings!
    isSpoiler: Boolean!
    user: User!
    comments: [Comment!]!
    likesCount: Int!
    commentsCount: Int!
    creadtedAt: String!
  }

  type Query {
    getAllReviewOfMovie(movieName: String!): [Review!]!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    createReview(
      title: String!
      content: String!
      rating: Ratings!
      isSpoiler: Boolean!
      movieName: String!
    ): MutationResponse
  }
`;
