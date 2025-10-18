import { Ratings } from '@prisma/client';
import {
  movieSocialModalDelete,
  movieSocialModalCreate,
  movieSocialModalGet,
  movieSocialModalUpdate,
} from '../modal/movieSocialModal';
import { TCreateComment, TCreateLike } from '../types/movieSocial.types';
import { searchMovieTeam } from '../modal/movieTeamModal';
// import { userModal } from '../modal/userModal';

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
const createDisLike = async (data: TCreateLike) => {
  try {
    const like = await movieSocialModalCreate.createDislike(data);
    if (!like) {
      return {
        success: false,
        message: 'Failed to register DisLike',
      };
    }
    return {
      success: true,
      message: 'DisLike register',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to DisLike the review',
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
      message: 'Unexpected Error:Failed to register Comment',
    };
  }
};
const createWatchList = async (
  movieName: string,
  userId: number,
  note: string
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
    const data = { movieId, userId, note };
    const watchList = await movieSocialModalCreate.createWatchList(data);
    if (!watchList) {
      return {
        success: false,
        message: 'Failed to create the watch list item',
      };
    }
    return {
      success: true,
      message: 'Watch list created',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to create the watch list',
    };
  }
};
export const createFollow = async (followerId: number, followingId: number) => {
  try {
    const alreadyFollow = await movieSocialModalGet.getIsUserFollow(
      followerId,
      followingId
    );

    if (alreadyFollow !== null) {
      return {
        success: false,
        message: 'Already followed',
      };
    }
    const data = {
      followerId,
      followingId,
    };
    const follow = await movieSocialModalCreate.createFollow(data);
    if (!follow) {
      return {
        success: false,
        message: 'Failed to createt the follow',
      };
    }
    return {
      success: true,
      message: 'Following',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const movieSocialCreate = {
  createReview,
  createLike,
  createComment,
  createWatchList,
  createDisLike,
  createFollow,
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
const getAllWatchList = async (userId: number) => {
  try {
    const watchList = await movieSocialModalGet.getAllWatchList(userId);
    if (!watchList) {
      return {
        success: false,
        message: 'No watchlist found',
        data: [],
      };
    }
    console.log('watch list item--', watchList);
    return {
      success: true,
      message: '---All WatchList Item---',
      data: watchList,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error : Failed to fetch the watchlist items',
      data: [],
    };
  }
};
export const MovieSocialGet = { getAllReviewOfMovie, getAllWatchList };
const updateMovieWatchList = async (movieName: string, userId: number) => {
  try {
    const movie = await searchMovieTeam.findMovieByName(movieName);
    if (!movie) {
      return {
        success: false,
        message: 'No Movie found',
      };
    }
    const movieId = Number(movie.id);
    const updateStatus = await movieSocialModalUpdate.updateWatchListItem(
      movieId,
      userId
    );
    if (!updateStatus) {
      return {
        success: false,
        message: 'Failed to update the status',
      };
    }
    return {
      success: true,
      message: 'Status Updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};

export const MovieSocialUpdate = { updateMovieWatchList };
const deleteLike = async (likeId: number) => {
  try {
    const isLiked = await movieSocialModalGet.getLikedOrNot(likeId);
    if (!isLiked) {
      return {
        success: false,
        message: 'No like found',
      };
    }
    const removeLike = await movieSocialModalDelete.deleteLike(likeId);
    if (!removeLike) {
      return {
        success: false,
        message: 'Failed to remove the like',
      };
    }
    return {
      success: true,
      message: 'Like removed',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteDisLike = async (disLikeId: number) => {
  try {
    const isLiked = await movieSocialModalGet.getDisLikedOrNot(disLikeId);
    if (!isLiked) {
      return {
        success: false,
        message: 'No like found',
      };
    }
    const removeLike = await movieSocialModalDelete.deleteDisLike(disLikeId);
    if (!removeLike) {
      return {
        success: false,
        message: 'Failed to remove the DisLike',
      };
    }
    return {
      success: true,
      message: 'DisLike removed',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteFollowData = async (followerId: number, followingId: number) => {
  try {
    const doesFollow = await movieSocialModalGet.getIsUserFollow(
      followerId,
      followingId
    );
    if (!doesFollow) {
      return {
        success: false,
        message: 'Follow first',
      };
    }
    const followId = Number(doesFollow.id);
    const unfollow = await movieSocialModalDelete.deleteFollow(followId);
    if (!unfollow) {
      return {
        success: false,
        message: 'Failed to unfollow',
      };
    }
    return {
      success: true,
      message: 'User is Unfollowed',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const MovieSocialDelete = {
  deleteLike,
  deleteDisLike,
  deleteFollowData,
};
