import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
  }
  enum Role {
    user
    moderator
    admin
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
      role: Role!
    ): MutationResponse!
    verifyOtp(otp: String!): MutationResponse!
    resendOtp(email: String!): MutationResponse!
    updateUsername(newUsername: String!): MutationResponse!
  }
`;
