import { movieSocialModalCreate } from '../modal/movieSocialModal';
import {
  TCreateComment,
  TCreateLike,
  TCreateReview,
  TWatchListItem,
} from '../types/movieSocial.types';

const createReview = async (data: TCreateReview) => {
  try {
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
