import prisma from '../prisma/client';
import { TGetSeries, TSeriesGenre } from '../types/series.types';
export const seriesModal = {
  getAllSeriesData,
  getAllSeries,
  getSeriesByName,
  createSeries,
  createGenre,
  checkGenereExist,
  getGenre,
  getgnreByName,
  createSeriesGenre,
  updateSeries,
  deleteSeries,
};

async function getAllSeries(): Promise<TGetSeries[]> {
  const data = await prisma.series.findMany({
    include: {
      SeriesGenre: {
        include: {
          genre: true,
        },
      },
      SeriesReview: true,
    },
  });
  return data;
}
async function createSeries(data: any, poster: string) {
  console.log('poster path---', poster);
  console.log('poster path---', typeof poster);
  try {
    return await prisma.series.create({
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
        SeriesGenre: {
          create: data.genreIds?.map((id: number) => ({
            generesId: id,
          })),
        },
      },
    });
  } catch (err) {
    console.log('error in the create series--catch---', err);
    return;
  }
}
async function getSeriesByName(title: string) {
  return await prisma.series.findUnique({
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
async function getAllSeriesData() {
  const data = await prisma.series.findMany({
    include: {
      SeriesCastMember: {
        include: {
          // Include the person details for cast members
          person: true,
        },
      },
      SeriesGenre: {
        include: {
          genre: true, // Include the genre details
        },
      },
      SeriesCrewMember: {
        include: {
          person: true, // Include person details for crew members
        },
      },
      SeriesProductionCompany: {
        include: {
          company: true, // Include company details
        },
      },
      SeriesReview: {
        include: {
          _count: {
            select: {
              SeriesComment: true,
              SeriesLike: true,
              SeriesDislike: true,
            },
          },
          user: true,
          SeriesComment: true,
        },
      },
    },
  });

  return data;
}
async function getGenre() {
  return await prisma.genre.findMany();
}
async function getgnreByName({ genreName }: TSeriesGenre) {
  const dataMap = genreName.map(async (m) => {
    const data = m.name;

    return await prisma.genre.findUnique({
      where: { name: data },
    });
  });
  return await Promise.all(dataMap);
}
async function createSeriesGenre(seriesId: number, genreId: number) {
  return await prisma.seriesGenre.create({
    data: {
      generesId: genreId,
      seriesId: seriesId,
    },
  });
}
async function updateSeries(data: any, poster: string) {
  return await prisma.series.update({
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
async function deleteSeries(title: string) {
  return await prisma.series.delete({
    where: {
      title: title,
    },
  });
}
