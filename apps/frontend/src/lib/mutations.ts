import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $email: String!
    $password: String!
    $role: Role!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      role: $role
    ) {
      success
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtp($otp: String!) {
    verifyOtp(otp: $otp) {
      success
      message
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOtp($email: String!) {
    resendOtp(email: $email) {
      success
      message
    }
  }
`;
