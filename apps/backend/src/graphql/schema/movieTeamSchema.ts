import { gql } from 'apollo-server-express';

export const movieTeamTypeDefs = gql`
  scalar Upload
  type MutationResponse {
    success: Boolean!
    message: String!
  }
  type ProductionCompany {
    name: String!
    logo: Upload
    originCountry: String!
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
  }
`;
