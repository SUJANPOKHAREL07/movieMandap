import { seriesStatus } from '@prisma/client';

export interface TSeries {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  posterPath?: string | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: seriesStatus;
  tagline?: string | null;
  adult: boolean;
  trailerLink: string | null;
}
export interface TSeriesInput {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: seriesStatus;
  tagline?: string | null;
  adult: boolean;
  trailerLink: string | null;
  poster?: TFile;
  genreIds?: number[];
}
export interface TSeriesUpdate {
  title?: string | null;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  budget?: bigint | null;
  revenue?: bigint | null;
  status: seriesStatus;
  tagline?: string | null;
  adult?: boolean | null;
  trailerLink?: string | null;
  poster?: TFile;
}
export interface TFile {
  filename?: string;
  mimetype?: string;
  encoding?: string;
  createReadStream: () => NodeJS.ReadableStream;
}
export interface TGetSeries {
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: Date | null;
  runtime?: number | null;
  posterPath?: string | null;
  budget?: number | null;
  revenue?: number | null;
  status: seriesStatus | null;
  tagline?: string | null;
  adult: boolean | null;
  trailerLink: String | null;
}
export interface TSeriesResponse {
  success: boolean;
  message: string;
  data?: TGetSeries[] | undefined;
}
export interface TSeriesGenre {
  seriesName: string;
  genreName: TGenre[];
}
export interface TGenre {
  name: string;
}
