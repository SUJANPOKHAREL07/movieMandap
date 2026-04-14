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
  }

  type SeasonReview {
    id: Int!
    title: String!
    content: String!
    rating: Ratings!
    isSpoiler: Boolean!
    user: User!
    likesCount: Int!
    disLikesCount: Int!
    commentsCount: Int!
    userHasLiked: Boolean
    userHasDisliked: Boolean
    createdAt: Date!
    updatedAt: Date!
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
    ): MutationResponse

    updateSeason(
      id: Int!
      title: String
      overview: String
      airDate: Date
      episodeCount: Int
      posterBase64: String
    ): MutationResponse

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
  }
`;
