import { gql } from 'apollo-server-express';

export const episodeSchema = gql`
  type Episode {
    id: Int!
    seasonId: Int!
    episodeNumber: Int!
    title: String
    overview: String
    airDate: Date
    runtime: Int
    posterPath: String
  }

  type EpisodeMutationResponse {
    success: Boolean!
    message: String!
    episode: Episode
  }

  extend type Query {
    getEpisodesOfSeason(seasonId: Int!): [Episode!]!
  }

  extend type Mutation {
    addEpisode(
      seasonId: Int!
      episodeNumber: Int!
      title: String
      overview: String
      airDate: Date
      runtime: Int
      posterBase64: String
    ): EpisodeMutationResponse

    updateEpisode(
      id: Int!
      episodeNumber: Int
      title: String
      overview: String
      airDate: Date
      runtime: Int
      posterBase64: String
    ): EpisodeMutationResponse

    deleteEpisode(id: Int!): MutationResponse
  }
`;
