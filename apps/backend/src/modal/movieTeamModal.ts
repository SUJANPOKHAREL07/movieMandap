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

async function registerMovieProductionCompany({
  movieId,
  companyId,
}: TMovieProductionCompany) {
  return await prisma.movieProductionCompany.create({
    data: {
      movieId: movieId,
      conpanyId: companyId,
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
async function findMovieByName(moviename: string) {
  return await prisma.movie.findUnique({
    where: {
      title: moviename,
    },
  });
}
async function findComanyByName(companyname: string) {
  return await prisma.productionCompany.findFirst({
    where: {
      name: companyname,
    },
  });
}
async function findPersonByName(personname: string) {
  return await prisma.person.findFirst({
    where: {
      name: personname,
    },
  });
}
export const searchMovieTeam = {
  findMovieByName,
  findComanyByName,
  findPersonByName,
};
async function getAllProductionCopany() {
  return await prisma.productionCompany.findMany();
}
async function getAllMovieProductionCompany() {
  return await prisma.movieProductionCompany.findMany();
}
async function getAllMoviePerson() {
  return await prisma.person.findMany();
}
async function getAllCrewMember() {
  return await prisma.crewMember.findMany();
}
async function getAllCastMember() {
  return await prisma.castMember.findMany();
}
export const movieTeamModalGet = {
  getAllProductionCopany,
  getAllMovieProductionCompany,
  getAllCastMember,
  getAllMoviePerson,
  getAllCrewMember,
};
