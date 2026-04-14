// import path from 'path';
import { seriesModal } from '../modal/seriesModal';
import { searchSeriesTeam } from '../modal/seriesTeamModal';
import {
  TGetSeries,
  TSeriesGenre,
  TSeriesInput,
  TSeriesResponse,
  TSeriesUpdate,
} from '../types/series.types';
import { TResponse } from '../types/user.types';
// import fs from 'fs';
// import { randomUUID } from 'crypto';
const getAllSeries = async (): Promise<TSeriesResponse> => {
  const getData: TGetSeries[] = await seriesModal.getAllSeries();
  // console.log('get data of the seriess', getData);
  if (!getData) {
    return {
      success: true,
      message: 'Failed to get the series',
      data: [],
    };
  }
  return {
    success: true,
    message: 'All series',
    data: getData,
  };
};
const createSeries = async (
  data: TSeriesInput,
  poster: string
): Promise<TResponse> => {
  try {
    console.log('poster and data', poster, data);

    const createSeries = await seriesModal.createSeries(data, poster);

    if (!createSeries) {
      throw new Error('Failed in move creation controller');
    }
    return {
      message: 'Series created',
      success: true,
    };
  } catch (err) {
    throw new Error('Failed to create the series');
  }
};
const createGenre = async (name: string) => {
  try {
    const checkExist = await seriesModal.checkGenereExist(name);
    if (checkExist !== null) {
      throw new Error('Genere already exist');
    }
    const createGenre = await seriesModal.createGenre(name);
    if (!createGenre) {
      return {
        success: false,
        message: 'Failed to create the genre',
      };
    }
    return {
      success: true,
      message: 'Genre created',
    };
  } catch (err) {
    console.log('creaet genere error --', err);
    throw new Error('Unexpected error occur');
  }
};
const getGenre = async () => {
  try {
    const data = await seriesModal.getGenre();
    if (!data) {
      return {
        success: false,
        message: 'No Genre found',
      };
    }
    return {
      success: true,
      message: 'All Genre',
      data: data,
    };
  } catch (err) {
    console.log('Failed to get genre', err);
    throw new Error('Failed to get the genre');
  }
};

const createSeriesGenre = async ({ seriesName, genreName }: TSeriesGenre) => {
  try {
    const doesSeriesExist = await seriesModal.getSeriesByName(seriesName);
    if (!doesSeriesExist) {
      return {
        success: false,
        message: 'No series found',
      };
    }

    const doesGenreExist = await seriesModal.getgnreByName({
      seriesName,
      genreName,
    });
    if (doesGenreExist == null) {
      return {
        success: false,
        message: 'No genre found',
      };
    }
    const genreId = Number(
      doesGenreExist.map((m) => {
        return m?.id;
      })
    );
    const data = await seriesModal.createSeriesGenre(doesSeriesExist.id, genreId);
    if (!data) {
      throw new Error('Failed to register the series genre');
    }
    return {
      success: true,
      message: 'Series genre register',
    };
  } catch (err) {
    console.log('error in the catch--', err);
    throw new Error('Failed to enter the series genre');
  }
};
const getAllSeriesData = async () => {
  try {
    const data = await seriesModal.getAllSeriesData();

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No data found',
        data: [],
      };
    }

    return {
      success: true,
      message: 'All series data',
      data: data,
    };
  } catch (error) {
    console.error('Error in getAllSeriesData service:', error);
    return {
      success: false,
      message: 'Error fetching series data',
      data: [],
    };
  }
};
const updateSeries = async (data: TSeriesUpdate, poster: string) => {
  try {
    if (!data) {
      return {
        success: false,
        message: 'Failed: No data provided to update',
        data: data,
      };
    }
    const update = await seriesModal.updateSeries(data, poster);
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the series data',
        data: [],
      };
    }
    return {
      success: true,
      message: 'Series data updated successfully',
      data: [update],
    };
  } catch (err) {
    return {
      success: false,
      message: err,
      data: [],
    };
  }
};
const deleteSeries = async (seriesname: string) => {
  try {
    console.log('Series data', seriesname);
    const searchSeries = await searchSeriesTeam.findSeriesByName(seriesname);
    console.log('Series data', searchSeries);
    if (!searchSeries) {
      return {
        success: false,
        message: 'Failed :No series found',
      };
    }
    const deleteData = await seriesModal.deleteSeries(seriesname);
    if (!deleteData) {
      return {
        success: false,
        message: 'Failed to delete the series data',
      };
    }
    return {
      success: true,
      message: 'Series data is deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const seriesService = {
  getAllSeries,
  createSeries,
  createGenre,
  getGenre,
  createSeriesGenre,
  getAllSeriesData,
  updateSeries,
  deleteSeries,
};
