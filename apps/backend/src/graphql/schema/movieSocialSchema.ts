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
    createdAt: String!
    updatedAt: String!
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
    createdAt: Date!
    updatedAt: Date!
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
    getFollowing: Int
    getFollower: Int
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
    createComment(
      content: String!
      reviewId: Int!
      parentId: Int
    ): MutationResponse
    updateReview(
      reviewId: Int!
      title: String
      content: String
      rating: Ratings
      isSpoiler: Boolean
    ): MutationResponse
    deleteReview(reviewId: Int!): MutationResponse
    updateComment(commentId: Int!, content: String!): MutationResponse
    deleteComment(commentId: Int!): MutationResponse
    createWatchList(movieName: String!, note: String): MutationResponse
    createFollow(toFollowId: Int): MutationResponse
    updateWatchListStatus(movieName: String): MutationResponse
    createLike(reviewId: Int): MutationResponse
    deleteLike(likeId: Int): MutationResponse
    createDisLike(reviewId: Int): MutationResponse
    deleteDisLike(disLikeId: Int): MutationResponse
    unFollow(notToFollowId: Int): MutationResponse
  }
`;
