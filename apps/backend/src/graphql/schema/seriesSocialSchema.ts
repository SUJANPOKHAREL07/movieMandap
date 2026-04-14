import { gql } from 'apollo-server-express';

export const seriesSocialTypeDef = gql`

  type SeriesComment {
    id: Int!
    content: String!
    user: User!
    parentId: Int
    replies: [SeriesComment!]
    likesCount: Int!
    disLikesCount: Int!
    userHasLiked: Boolean
    userHasDisliked: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type SeriesReview {
    id: Int!
    title: String!
    content: String!
    rating: Ratings!
    isSpoiler: Boolean!
    user: User!
    comments: [SeriesComment!]!
    likesCount: Int!
    disLikesCount: Int!
    commentsCount: Int!
    userHasLiked: Boolean
    userHasDisliked: Boolean
    createdAt: Date!
    updatedAt: Date!
  }

  type SeriesSummary {
    title: String
    posterPath: String
    adult: Boolean
  }

  type SeriesWatchList {
    note: String
    status: watchStatus
    series: SeriesSummary!
  }

  extend type Query {
    getAllReviewOfSeries(seriesName: String!): [SeriesReview!]!
    getAllSeriesWatchList: [SeriesWatchList]
  }

  extend type Mutation {
    createSeriesReview(
      title: String!
      content: String!
      rating: Ratings!
      isSpoiler: Boolean!
      seriesName: String!
    ): MutationResponse

    createSeriesComment(
      content: String!
      reviewId: Int!
      parentId: Int
    ): MutationResponse

    updateSeriesReview(
      reviewId: Int!
      title: String
      content: String
      rating: Ratings
      isSpoiler: Boolean
    ): MutationResponse

    deleteSeriesReview(reviewId: Int!): MutationResponse
    updateSeriesComment(commentId: Int!, content: String!): MutationResponse
    deleteSeriesComment(commentId: Int!): MutationResponse
    createSeriesWatchList(seriesName: String!, note: String): MutationResponse
    updateSeriesWatchListStatus(seriesName: String): MutationResponse
    
    toggleSeriesReviewLike(reviewId: Int!): MutationResponse
    toggleSeriesReviewDislike(reviewId: Int!): MutationResponse
    toggleSeriesCommentLike(commentId: Int!): MutationResponse
    toggleSeriesCommentDislike(commentId: Int!): MutationResponse

    createSeriesLike(reviewId: Int): MutationResponse
    deleteSeriesLike(likeId: Int): MutationResponse
    createSeriesDislike(reviewId: Int): MutationResponse
    deleteSeriesDislike(disLikeId: Int): MutationResponse
  }
`;
