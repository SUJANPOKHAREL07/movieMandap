import prisma from '../prisma/client';
import {
  TCastMember,
  TCrewMember,
  TSeriesProductionCompany,
  TSeriesTeamProductionCompanyCreate,
  TPersonCreate,
} from '../types/seriesTeam.types';

async function registerProductionCompany(
  data: TSeriesTeamProductionCompanyCreate
) {
  return await prisma.productionCompany.create({
    data: {
      name: data?.name,
      originCountry: data?.originCountry,
      logoPath: data?.logoPath,
    },
  });
}

async function registerSeriesProductionCompany({
  seriesId,
  companyId,
}: TSeriesProductionCompany) {
  return await prisma.seriesProductionCompany.create({
    data: {
      seriesId: seriesId,
      conpanyId: companyId,
    },
  });
}
async function registerSeriesPerson(data: TPersonCreate) {
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
  return await prisma.seriesCrewMember.create({
    data: {
      department: data.department,
      personId: data.personId,
      seriesId: data.seriesId,
      job: data.job,
    },
  });
}
async function registerCastMember(data: TCastMember) {
  return await prisma.seriesCastMember.create({
    data: {
      seriesId: data.seriesId,
      personId: data.personId,
      character: data.character,
      creditId: data.creditId,
    },
  });
}
export const seriesTeamModalCreate = {
  registerProductionCompany,
  registerSeriesProductionCompany,
  registerSeriesPerson,
  registerCrewMember,
  registerCastMember,
};
async function updateProductionComany(
  id: number,
  logoPath?: string,
  name?: string,
  originCountry?: string
) {
  return await prisma.productionCompany.update({
    where: {
      id: id,
    },
    data: {
      logoPath: logoPath,
      name: name,
      originCountry: originCountry,
    },
  });
}
async function updateSeriesProductionComapny(
  id: number,
  companyId?: number,
  seriesId?: number
) {
  return await prisma.seriesProductionCompany.update({
    where: {
      id: id,
    },
    data: {
      conpanyId: companyId,
      seriesId: seriesId,
    },
  });
}
async function updateSeriesPerson(
  id: number,
  adult?: boolean,
  birthPlace?: string,
  name?: string,
  deathDay?: Date,
  birthDay?: Date,
  socialPath?: string
) {
  return await prisma.person.update({
    where: {
      id: id,
    },
    data: {
      adult: adult,
      birthPlace: birthPlace,
      name: name,
      deathDay: deathDay,
      birthDay: birthDay,
      socialPath: socialPath,
    },
  });
}
async function updateCrewMember(
  id: number,
  department?: string,
  job?: string,
  personId?: number,
  seriesId?: number
) {
  return await prisma.seriesCrewMember.update({
    where: {
      id: id,
    },
    data: {
      department: department,
      job: job,
      seriesId: seriesId,
      personId: personId,
    },
  });
}
async function updateCastMember(
  id: number,
  character?: string,
  creditId?: string,
  seriesId?: number,
  personId?: number
) {
  return await prisma.seriesCastMember.update({
    where: {
      id: id,
    },
    data: {
      character: character,
      creditId: creditId,
      seriesId: seriesId,
      personId: personId,
    },
  });
}
export const seriesTeamModalUpdate = {
  updateCastMember,
  updateCrewMember,
  updateSeriesPerson,
  updateSeriesProductionComapny,
  updateProductionComany,
};
async function deleteProductionCompany(id: number) {
  return await prisma.productionCompany.delete({
    where: {
      id: id,
    },
  });
}
async function deleteSeriesProductionCompany(id: number) {
  return await prisma.seriesProductionCompany.delete({
    where: {
      id: id,
    },
  });
}
async function deleteSeriesPerson(id: number) {
  return await prisma.person.delete({
    where: {
      id: id,
    },
  });
}
async function deleteCastMember(id: number) {
  return await prisma.seriesCastMember.delete({
    where: {
      id: id,
    },
  });
}
async function deleteCrewMember(id: number) {
  return await prisma.seriesCrewMember.delete({
    where: {
      id: id,
    },
  });
}
export const seriesTeamModalDelete = {
  deleteCastMember,
  deleteCrewMember,
  deleteSeriesPerson,
  deleteSeriesProductionCompany,
  deleteProductionCompany,
};
async function findSeriesByName(seriesname: string) {
  return await prisma.series.findUnique({
    where: {
      title: seriesname,
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
export const searchSeriesTeam = {
  findSeriesByName,
  findComanyByName,
  findPersonByName,
};
async function getAllProductionCopany() {
  return await prisma.productionCompany.findMany({
    include: {
      SeriesProductionCompany: true,
    },
  });
}
async function getAllSeriesProductionCompany() {
  return await prisma.seriesProductionCompany.findMany({
    include: {
      company: true,
      series: true,
    },
  });
}
async function getAllSeriesPerson() {
  return await prisma.person.findMany({
    include: {
      SeriesCastMember: true,
      SeriesCrewMember: true,
    },
  });
}
async function getAllCrewMember() {
  return await prisma.seriesCrewMember.findMany({
    include: {
      series: true,
      person: true,
    },
  });
}
async function getAllCastMember() {
  return await prisma.seriesCastMember.findMany({
    include: {
      series: true,
      person: true,
    },
  });
}
export const seriesTeamModalGet = {
  getAllProductionCopany,
  getAllSeriesProductionCompany,
  getAllCastMember,
  getAllSeriesPerson,
  getAllCrewMember,
};
