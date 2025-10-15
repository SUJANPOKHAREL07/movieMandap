import { gql } from 'apollo-server-express';

export const movieTeamTypeDefs = gql`
  scalar Upload
  scalar Date
  type MutationResponse {
    success: Boolean!
    message: String!
  }
  type ProductionCompany {
    name: String!
    logo: Upload
    originCountry: String!
  }
  type Person {
    name: String!
    birthday: Date!
    deathday: Date
    birthPlace: String
    socialPath: String
    adult: Boolean!
  }
  type Mutation {
    registerProductionCompany(
      name: String!
      logo: Upload!
      originCountry: String!
    ): MutationResponse
    registerMovieProductionCompany(
      moviename: String!
      companyname: String!
    ): MutationResponse
    registerPerson(
      name: String!
      birthday: Date!
      deathday: Date
      birthPlace: String
      socialPath: String
      adult: Boolean!
    ): MutationResponse
    registerCrewMember(
      personName: String!
      movieName: String!
      department: String!
      job: String!
    ): MutationResponse
    registerCastMember(
      movieName: String!
      personName: String!
      character: String!
      creditId: String!
    ): MutationResponse
  }
`;
