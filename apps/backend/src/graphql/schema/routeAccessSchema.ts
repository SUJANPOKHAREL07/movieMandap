import { gql } from 'apollo-server-express';

export const routeAccessTypeDefs = gql`
  type RouteAccess {
    routeId: String!
    role: String!
    allowed: Boolean!
  }

  input RouteAccessInput {
    routeId: String!
    role: String!
    allowed: Boolean!
  }

  type Query {
    getRouteAccess: [RouteAccess!]!
  }

  type Mutation {
    saveRouteAccess(rules: [RouteAccessInput!]!): MutationResponse!
  }
`;
