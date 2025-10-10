import prisma from '../prisma/client';
import {
  TCastMember,
  TCrewMember,
  TMovieProductionCompany,
  TMovieTeamProductionCompanyCreate,
  TPersonCreate,
} from '../types/movieTeam.types';

async function registerProductionCompany(
  data: TMovieTeamProductionCompanyCreate
) {
  return await prisma.productionCompany.create({
    data: {
      name: data?.name,
      originCountry: data?.originCountry,
      logoPath: data?.logoPath,
    },
  });
}

async function registerMovieProductionCompany(data: TMovieProductionCompany) {
  return await prisma.movieProductionCompany.create({
    data: {
      movieId: data.movieId,
      conpanyId: data.companyId,
    },
  });
}
async function registerMoviePerson(data: TPersonCreate) {
  return await prisma.person.create({
    data: {
      name: data.name,
      birthDay: data.birthday,
      deathDay: data.deathday,
      birthPlace: data.birthPlace,
      socialPath: data.socialPath,
      adult: data.adult,
    },
  });
}
async function registerCrewMember(data: TCrewMember) {
  return await prisma.crewMember.create({
    data: {
      department: data.department,
      personId: data.personId,
      movieId: data.movieId,
      job: data.job,
    },
  });
}
async function registerCastMember(data: TCastMember) {
  return await prisma.castMember.create({
    data: {
      movieId: data.movieId,
      personId: data.personId,
      character: data.character,
      creditId: data.creditId,
    },
  });
}
export const movieTeamModalCreate = {
  registerProductionCompany,
  registerMovieProductionCompany,
  registerMoviePerson,
  registerCrewMember,
  registerCastMember,
};
