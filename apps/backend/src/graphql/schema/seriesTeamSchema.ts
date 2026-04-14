import { gql } from 'apollo-server-express';

export const seriesTeamTypeDefs = gql`
  type SeriesProductionCompany {
    id: Int
    seriesId: Int
    conpanyId: Int
  }
  type SeriesPerson {
    name: String
    id: Int
    birthDay: Date
    deathDay: Date
    birthPlace: String
    socialPath: String
    adult: Boolean
  }
  type SeriesCrewMember {
    id: Int
    seriesId: Int
    department: String
    job: String
    personId: Int
  }
  type SeriesCastMember {
    id: Int
    seriesId: Int
    personId: Int
    character: String
    creditId: String
  }

  extend type Query {
    getAllSeriesProductionCompany: [SeriesProductionCompany]
    getAllSeriesCastMember: [SeriesCastMember]
    getAllSeriesCrewMember: [SeriesCrewMember]
  }

  extend type Mutation {
    registerSeriesProductionCompany(
      seriesname: String!
      companyname: String!
    ): MutationResponse

    updateSeriesProductionCompany(
      id: Int!
      companyId: Int
      seriesId: Int
    ): MutationResponse

    deleteSeriesProductionCompany(id: Int!): MutationResponse

    registerSeriesCrewMember(
      personName: String!
      seriesName: String!
      department: String!
      job: String!
    ): MutationResponse

    updateSeriesCrewMember(
      id: Int!
      personName: String
      seriesName: String
      department: String
      job: String
    ): MutationResponse

    deleteSeriesCrewMember(id: Int!): MutationResponse

    registerSeriesCastMember(
      seriesName: String!
      personName: String!
      character: String!
      creditId: String!
    ): MutationResponse

    updateSeriesCastMember(
      id: Int!
      seriesName: String
      personName: String
      character: String
      creditId: String
    ): MutationResponse

    deleteSeriesCastMember(id: Int!): MutationResponse
  }
`;
