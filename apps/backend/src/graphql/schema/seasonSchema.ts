import { gql } from 'apollo-server-express';

export const seasonTypeDefs = gql`
  type Season {
    id: Int!
    seriesId: Int!
    seasonNumber: Int!
    title: String
    overview: String
    airDate: Date
    episodeCount: Int
    posterPath: String
    SeasonReview: [SeasonReview]
    episodes: [Episode]
  }

  type SeasonComment {
    id: Int!
    content: String!
    parentId: Int
    user: User!
    likesCount: Int!
    disLikesCount: Int!
    userHasLiked: Boolean
    userHasDisliked: Boolean
    createdAt: String!
    updatedAt: String!
    replies: [SeasonComment!]
  }

  type SeasonReview {
    id: Int!
    title: String!
    content: String!
    rating: Ratings!
    isSpoiler: Boolean!
    user: User!
    comments: [SeasonComment!]
    likesCount: Int!
    disLikesCount: Int!
    commentsCount: Int!
    userHasLiked: Boolean
    userHasDisliked: Boolean
    createdAt: String!
    updatedAt: String!
    episodes: [Episode]
  }

  type SeasonMutationResponse {
    success: Boolean!
    message: String!
    season: Season
  }

  extend type Query {
    getSeasonsOfSeries(seriesId: Int!): [Season]
    getAllReviewsOfSeason(seasonId: Int!): [SeasonReview!]!
  }

  extend type Mutation {
    addSeason(
      seriesId: Int!
      seasonNumber: Int!
      title: String
      overview: String
      airDate: Date
      episodeCount: Int
      posterBase64: String
    ): SeasonMutationResponse

    updateSeason(
      id: Int!
      seasonNumber: Int
      title: String
      overview: String
      airDate: Date
      episodeCount: Int
      posterBase64: String
    ): SeasonMutationResponse


    deleteSeason(id: Int!): MutationResponse

    createSeasonReview(
      seasonId: Int!
      title: String!
      content: String!
      rating: Ratings!
      isSpoiler: Boolean!
    ): MutationResponse

    updateSeasonReview(
      reviewId: Int!
      title: String
      content: String
      rating: Ratings
      isSpoiler: Boolean
    ): MutationResponse

    deleteSeasonReview(reviewId: Int!): MutationResponse

    toggleSeasonReviewLike(reviewId: Int!): MutationResponse
    toggleSeasonReviewDislike(reviewId: Int!): MutationResponse

    createSeasonComment(reviewId: Int!, content: String!, parentId: Int): MutationResponse
    updateSeasonComment(commentId: Int!, content: String!): MutationResponse
    deleteSeasonComment(commentId: Int!): MutationResponse
    toggleSeasonCommentLike(commentId: Int!): MutationResponse
    toggleSeasonCommentDislike(commentId: Int!): MutationResponse
  }
`;
