import { Ratings } from '@prisma/client';
import {
  movieSocialModalCreate,
  movieSocialModalGet,
} from '../modal/movieSocialModal';
import {
  TCreateComment,
  TCreateLike,
  TWatchListItem,
} from '../types/movieSocial.types';
import { searchMovieTeam } from '../modal/movieTeamModal';

const createReview = async (
  title: string,
  content: string,
  isSpoiler: boolean,
  rating: Ratings,
  movieName: string,
  userId: number
) => {
  try {
    const movie = await searchMovieTeam.findMovieByName(movieName);
    if (!movie) {
      return {
        success: false,
        message: 'No movie found',
      };
    }
    const movieId = Number(movie.id);
    const data = {
      title,
      content,
      isSpoiler,
      rating,
      movieId,
      userId,
    };
    const review = await movieSocialModalCreate.createReview(data);
    if (!review) {
      return {
        success: false,
        message: 'Failed to create the review',
      };
    }
    return {
      success: true,
      message: 'review posted',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error: Failed to crete the review',
    };
  }
};
const createLike = async (data: TCreateLike) => {
  try {
    const like = await movieSocialModalCreate.createLike(data);
    if (!like) {
      return {
        success: false,
        message: 'Failed to register like',
      };
    }
    return {
      success: true,
      message: 'Like register',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to Like the review',
    };
  }
};
const createComment = async (data: TCreateComment) => {
  try {
    const comment = await movieSocialModalCreate.createComment(data);
    if (!comment) {
      return {
        success: false,
        message: 'Failed to register comment',
      };
    }
    return {
      success: true,
      message: 'Commented successfuly',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to register Commen',
    };
  }
};
const createWatchList = async (data: TWatchListItem) => {
  try {
    const watchList = await movieSocialModalCreate.createWatchList(data);
    if (!watchList) {
      return {
        success: false,
        message: 'Failed to create the watch list item',
      };
    }
    return {
      success: false,
      message: 'Watch list created',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to create the watch list',
    };
  }
};
export const movieSocialCreate = {
  createReview,
  createLike,
  createComment,
  createWatchList,
};
const getAllReviewOfMovie = async (movieName: string) => {
  try {
    // console.log('Movie name in the service:', movieName);
    const movie = await searchMovieTeam.findMovieByName(movieName);
    if (!movie) {
      return {
        success: false,
        message: 'Failed find the movie',
        data: [],
      };
    }
    // console.log('Movie details---', movie);
    const movieId = Number(movie.id);
    // console.log('move id get', movieId);
    const getReview = await movieSocialModalGet.getReviewOfMovieByID(movieId);
    if (!getReview) {
      return {
        success: false,
        message: 'No review found',
        data: [],
      };
    }
    // const getLikeCount = await movieSocialModalGet.countReviewLike();
    return {
      success: true,
      message: '----All Review----',
      data: getReview,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to get the review',
    };
  }
};
export const MovieSocialGet = { getAllReviewOfMovie };
