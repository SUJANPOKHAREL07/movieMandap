import { gql } from 'apollo-server-express';

export const seriesTypeDefs = gql`
  enum SeriesStatus {
    RELEASED
    IN_PRODUCTION
    POST_PRODUCTION
    PLANNED
    CANCELLED
    RUMORED
  }

  type SeriesGenre {
    id: Int
    seriesId: Int
    generesId: Int
    genre: Genre
  }

  type SeriesProductionCompany {
    id: Int
    seriesId: Int
    companyId: Int
    company: ProductionCompany
  }

  type SeriesCrewMember {
    id: Int
    seriesId: Int
    personId: Int
    department: String
    job: String
    person: Person
  }

  type SeriesCastMember {
    id: Int
    seriesId: Int
    personId: Int
    character: String
    creditId: String
    person: Person
  }

  type SeriesReviewCount {
    SeriesComment: Int
    SeriesLike: Int
    SeriesDislike: Int
  }

  type SeriesReview {
    id: Int
    title: String
    content: String
    rating: Ratings
    isSpoiler: Boolean
    createdAt: Date
    updatedAt: Date
    userId: Int
    seriesId: Int
    _count: SeriesReviewCount
    user: User
    comments: [SeriesComment]
  }

  type Series {
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
    status: SeriesStatus
    tagline: String
    adult: Boolean
    voteAverage: Float
    dominantRating: String
    SeriesGenre: [SeriesGenre]
    SeriesProductionCompany: [SeriesProductionCompany]
    SeriesCrewMember: [SeriesCrewMember]
    SeriesCastMember: [SeriesCastMember]
    SeriesReview: [SeriesReview]
  }

  extend type Query {
    getSeries: [Series]
    getAllSeriesData: [Series]
  }

  extend type Mutation {
    createSeries(
      title: String!
      originalTitle: String
      releaseDate: Date
      runtime: Int!
      posterBase64: String
      budget: Int!
      revenue: Int
      status: SeriesStatus!
      tagline: String!
      adult: Boolean!
      trailerLink: String
      genreIds: [Int]
    ): MutationResponse

    updateSeries(
      title: String
      originalTitle: String
      releaseDate: Date
      runtime: Int
      posterBase64: String
      budget: Int
      revenue: Int
      status: SeriesStatus
      tagline: String
      adult: Boolean
      trailerLink: String
    ): MutationResponse

    deleteSeries(title: String): MutationResponse
  }
`;
