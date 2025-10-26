import prisma from '../prisma/client';
import { TGetMovie, TMovieGenre } from '../types/movie.types';
export const movieModal = {
  getAllMovieData,
  getAllMovie,
  getMovieByName,
  createMovie,
  createGenre,
  checkGenereExist,
  getGenre,
  getgnreByName,
  createMovieGenre,
  updateMovie,
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
async function getMovieByName(title: string) {
  return await prisma.movie.findUnique({
    where: {
      title: title,
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
async function getAllMovieData() {
  const data = await prisma.movie.findMany({
    include: {
      CastMember: {
        include: {
          // Include the person details for cast members
          person: true,
        },
      },
      MovieGenre: {
        include: {
          genre: true, // Include the genre details
        },
      },
      crewMember: {
        include: {
          person: true, // Include person details for crew members
        },
      },
      MovieProductionCompany: {
        include: {
          company: true, // Include company details
        },
      },
      Review: {
        include: {
          _count: {
            select: {
              Comment: true,
              Like: true,
              Dislike: true,
            },
          },
          user: true,
          Comment: true,
        },
      },
    },
  });

  return data;
}
async function getGenre() {
  return await prisma.genre.findMany();
}
async function getgnreByName({ genreName }: TMovieGenre) {
  const dataMap = genreName.map(async (m) => {
    const data = m.name;

    return await prisma.genre.findUnique({
      where: { name: data },
    });
  });
  return await Promise.all(dataMap);
}
async function createMovieGenre(movieId: number, genreId: number) {
  return await prisma.movieGenre.create({
    data: {
      generesId: genreId,
      movieId: movieId,
    },
  });
}
async function updateMovie(data: any, poster: string) {
  return await prisma.movie.update({
    where: {
      title: data.title,
    },
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
