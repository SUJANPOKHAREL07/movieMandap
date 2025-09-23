export interface TMovie {
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate?: Date;
  runTime: number;
  posterPath?: string;
  budget: number;
  revenue?: number;
  // status:movieStatus
  tagline: string;
  adult: boolean;
}
