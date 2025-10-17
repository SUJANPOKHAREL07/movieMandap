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
  enum watchStatus {
    Watched
    Yet_To_Watch
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
    disLikesCount: Int!
    commentsCount: Int!
    creadtedAt: String!
  }
  type Movie {
    title: String
    posterPath: String
    adult: Boolean
  }
  type WatchList {
    note: String
    status: watchStatus
    movie: Movie!
  }

  type Query {
    getAllReviewOfMovie(movieName: String!): [Review!]!
    getAllWatchList: [WatchList]
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
    createWatchList(movieName: String!, note: String): MutationResponse
    updateWatchListStatus(movieName: String): MutationResponse
    createLike(reviewId: Int): MutationResponse
    deleteLike(likeId: Int): MutationResponse
    createDisLike(reviewId: Int): MutationResponse
    deleteDisLike(disLikeId: Int): MutationResponse
  }
`;
