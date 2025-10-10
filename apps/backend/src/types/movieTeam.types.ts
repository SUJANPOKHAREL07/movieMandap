export interface TMovieTeamProductionCompanyCreate {
  name: string;
  logoPath: string;
  originCountry: string;
}
export interface TMovieProductionCompany {
  movieId: number;
  companyId: number;
}

export interface TPersonCreate {
  name: string;
  birthday: Date;
  deathday?: Date;
  birthPlace: string;
  socialPath: string;
  adult: boolean;
}
export interface TCrewMember {
  movieId: number;
  personId: number;
  department: string;
  job: string;
}
export interface TCastMember {
  movieId: number;
  personId: number;
  character: string;
  creditId: string;
}
