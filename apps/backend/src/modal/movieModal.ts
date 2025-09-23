import prisma from '../prisma/client';
import { TMovie } from '../types/movie.types';
export const movieModal = {
  getAllMovie,
};

async function getAllMovie(): Promise<TMovie[]> {
  const data = await prisma.movie.findMany();
  return data;
}
