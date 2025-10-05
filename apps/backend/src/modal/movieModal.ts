import prisma from '../prisma/client';
import { TGetMovie } from '../types/movie.types';
export const movieModal = {
  getAllMovie,
  createMovie,
  createGenre,
  checkGenereExist,
};

async function getAllMovie(): Promise<TGetMovie[]> {
  const data = await prisma.movie.findMany();
  return data;
}
async function createMovie(data: any, poster: string) {
  return await prisma.movie.create({
    data: {
      title: data.title,
      originalTitle: data.originalTitle,
      overview: data.overview,
      releaseDate: data.releaseDate,
      runtime: data.runtime,
      posterPath: poster,
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      tagline: data.tagline,
      adult: data.adult,
      trailerLink: data.trailerLink,
    },
  });
}
async function createGenre(name: string) {
  return await prisma.genre.create({
    data: {
      name: name,
    },
  });
}
async function checkGenereExist(name: string) {
  return await prisma.genre.findUnique({
    where: {
      name: name,
    },
  });
}
