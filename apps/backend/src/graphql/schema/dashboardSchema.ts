import { gql } from 'apollo-server-express';

export const dashboardTypeDefs = gql`
  type AdminDashboardStats {
    totalMovies: Int!
    totalUsers: Int!
    totalReviews: Int!
  }

  type TopReviewer {
    id: Int!
    username: String!
    reviewCount: Int!
  }

  type TopMovie {
    id: Int!
    title: String!
    posterPath: String
    reviewCount: Int!
    averageRating: Float
  }

  type Query {
    getAdminDashboardStats: AdminDashboardStats!
    getTopReviewers(limit: Int!): [TopReviewer!]!
    getTopMovies(limit: Int!): [TopMovie!]!
  }
`;
