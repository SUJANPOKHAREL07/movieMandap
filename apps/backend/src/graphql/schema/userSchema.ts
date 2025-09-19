import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: String!
    username: String!
    email: String!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
      role: String
    ): MutationResponse!
    verifyOtp(otp: String!): MutationResponse!
    resendOtp(email: String!): MutationResponse!
  }
`;
