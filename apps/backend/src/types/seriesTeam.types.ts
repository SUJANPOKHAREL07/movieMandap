import { TFile } from './series.types';

export interface TSeriesTeamProductionCompanyCreate {
  name: string;
  logoPath?: string;
  originCountry: string;
  logo?: TFile;
}
export interface TSeriesTeamProductionCompanyUpdate {
  id: number;
  name?: string;
  logoPath?: string;
  originCountry?: string;
  logo?: TFile;
}
export interface TSeriesProductionCompany {
  seriesId: number;
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
  seriesId: number;
  personId: number;
  department: string;
  job: string;
}
export interface TCastMember {
  seriesId: number;
  personId: number;
  character: string;
  creditId: string;
}
