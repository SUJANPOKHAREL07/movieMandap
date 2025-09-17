import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: String!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
  }
`;
