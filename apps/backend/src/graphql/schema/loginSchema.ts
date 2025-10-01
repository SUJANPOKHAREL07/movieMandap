import { gql } from 'apollo-server-express';

export const LoginTypeDefs = gql`
  type login {
    email: String
    password: String!
    username: String
  }
  type Response {
    success: Boolean!
    message: String!
  }

  type Mutation {
    loginUser(email: String, username: String, password: String!): Response!
    logoutUser: Response!
    resetPassword(email: String, username: String): Response!
    resendResetPasswordOtp(email: String, username: String): Response!
    verifyResetPasswordOtp(otp: String!): Response!
  }
`;
