import { movieStatus } from '@prisma/client';

export interface TMovie {
  id: string;
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
}
export interface TMovieResponse {
  success: boolean;
  message: string;
  data?: TGetMovie[] | undefined;
}
