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
    updateProductionCompany(
      id: Int!
      name: String
      logo: Upload
      originCountry: String
    ): MutationResponse
    deleteProductionCompany(id: Int!): MutationResponse
    registerMovieProductionCompany(
      moviename: String!
      companyname: String!
    ): MutationResponse
    updateMovieProductionCompany(
      id: Int!
      companyId: Int
      movieId: Int
    ): MutationResponse

    deleteMovieProductionCompany(id: Int!): MutationResponse

    registerPerson(
      name: String!
      birthday: Date!
      deathday: Date
      birthPlace: String
      socialPath: String
      adult: Boolean!
    ): MutationResponse
    updatePerson(
      id: Int!
      name: String
      birthday: Date
      deathday: Date
      birthPlace: String
      socialPath: String
      adult: Boolean
    ): MutationResponse
    deletePerson(id: Int!): MutationResponse
    registerCrewMember(
      personName: String!
      movieName: String!
      department: String!
      job: String!
    ): MutationResponse
    updateCrewMember(
      id: Int!
      personName: String
      movieName: String
      department: String
      job: String
    ): MutationResponse
    deleteCrewMember(id: Int!): MutationResponse
    registerCastMember(
      movieName: String!
      personName: String!
      character: String!
      creditId: String!
    ): MutationResponse
    updateCastMember(
      id: Int!
      movieName: String
      personName: String
      character: String
      creditId: String
    ): MutationResponse
    deleteCastMember(id: Int!): MutationResponse
  }
`;
