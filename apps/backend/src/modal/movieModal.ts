import prisma from '../prisma/client';
import { TGetMovie } from '../types/movie.types';
export const movieModal = {
  getAllMovie,
};

async function getAllMovie(): Promise<TGetMovie[]> {
  const data = await prisma.movie.findMany();
  return data;
}
