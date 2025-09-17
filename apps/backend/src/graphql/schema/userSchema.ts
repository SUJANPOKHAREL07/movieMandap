import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: String!
    username: String!
    email: String!
    password: String!
  }
  input createUser {
    username: String!
    email: String!
    password: String!
  }

  type Update {
    email: String!
    username: String
    password: String
  }
  type Delete {
    success: Boolean!
    message: String!
    email: String!
  }
  type Get {
    id: String!
    username: String!
    email: String!
  }
  type Query {
    users: [Get!]!
  }
  type Mutation {
    createUser(email: String!, username: String!, password: String!): User!
    deleteUser(email: String!): Delete!
    updateUser(email: String!, username: String, password: String): Update!
  }
`;
