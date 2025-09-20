import { gql } from 'apollo-server-express';

export const LoginTypeDefs = gql`
  type login {
    email: String
    password: String!
    username: String
  }
  type loginResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    loginUser(
      email: String
      username: String
      password: String!
    ): loginResponse!
  }
`;
