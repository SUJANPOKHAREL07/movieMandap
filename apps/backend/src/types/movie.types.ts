import { movieStatus } from '@prisma/client';

export interface TMovie {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  posterPath?: string | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: movieStatus;
  tagline?: string | null;
  adult: boolean;
  trailerLink: string | null;
}
export interface TMovieInput {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: movieStatus;
  tagline?: string | null;
  adult: boolean;
  trailerLink: string | null;
  poster?: TFile;
}
export interface TFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}
export interface TGetMovie {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  posterPath?: string | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: movieStatus | null;
  tagline?: string | null;
  adult: boolean | null;
  trailerLink: String | null;
}
export interface TMovieResponse {
  success: boolean;
  message: string;
  data?: TGetMovie[] | undefined;
}
