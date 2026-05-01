import { Ratings } from '@prisma/client';
import {
  seriesSocialModalDelete,
  seriesSocialModalCreate,
  seriesSocialModalGet,
  seriesSocialModalUpdate,
} from '../modal/seriesSocialModal';
import { TCreateComment, TCreateLike } from '../types/seriesSocial.types';
import { searchSeriesTeam } from '../modal/seriesTeamModal';
// import { userModal } from '../modal/userModal';

const createReview = async (
  title: string,
  content: string,
  isSpoiler: boolean,
  rating: Ratings,
  seriesName: string,
  userId: number
) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'No series found',
      };
    }
    const seriesId = Number(series.id);
    const data = {
      title,
      content,
      isSpoiler,
      rating,
      seriesId,
      userId,
    };
    const review = await seriesSocialModalCreate.createReview(data);
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
  } catch (err: any) {
    console.error('Create SeriesReview Error:', err);
    if (err.code === 'P2002') {
      return {
        success: false,
        message: 'You have already reviewed this series! Only one review per user is allowed.',
      };
    }
    return {
      success: false,
      message: 'Unexpected error: Failed to create the review',
    };
  }
};
const deleteReview = async (reviewId: number, userId: number) => {
  try {
    const review = await seriesSocialModalGet.getReviewById(reviewId);
    if (!review) {
      return {
        success: false,
        message: 'No review found',
      };
    }
    if (review.userId !== userId) {
      return {
        success: false,
        message: 'Unauthorized: You can only delete your own reviews',
      };
    }
    const del = await seriesSocialModalDelete.deleteReview(reviewId);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the review',
      };
    }
    return {
      success: true,
      message: 'SeriesReview deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error occurred',
    };
  }
};
const createLike = async (data: TCreateLike) => {
  try {
    const like = await seriesSocialModalCreate.createLike(data);
    if (!like) {
      return {
        success: false,
        message: 'Failed to register like',
      };
    }
    return {
      success: true,
      message: 'SeriesLike register',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to SeriesLike the review',
    };
  }
};
const createDisLike = async (data: TCreateLike) => {
  try {
    const like = await seriesSocialModalCreate.createDislike(data);
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

const toggleReviewLike = async (userId: number, reviewId: number) => {
  try {
    return await seriesSocialModalCreate.toggleReviewLike(userId, reviewId);
  } catch (err) {
    return { success: false, message: 'Failed to toggle like' };
  }
};

const toggleReviewDislike = async (userId: number, reviewId: number) => {
  try {
    return await seriesSocialModalCreate.toggleReviewDislike(userId, reviewId);
  } catch (err) {
    return { success: false, message: 'Failed to toggle dislike' };
  }
};

const toggleCommentLike = async (userId: number, commentId: number) => {
  try {
    return await seriesSocialModalCreate.toggleCommentLike(userId, commentId);
  } catch (err) {
    return { success: false, message: 'Failed to toggle comment like' };
  }
};

const toggleCommentDislike = async (userId: number, commentId: number) => {
  try {
    return await seriesSocialModalCreate.toggleCommentDislike(userId, commentId);
  } catch (err) {
    return { success: false, message: 'Failed to toggle comment dislike' };
  }
};

const createComment = async (data: TCreateComment) => {
  try {
    const comment = await seriesSocialModalCreate.createComment(data);
    if (!comment) {
      return {
        success: false,
        message: 'Failed to register comment',
      };
    }
    return {
      success: true,
      message: 'SeriesCommented successfuly',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to register SeriesComment',
    };
  }
};
const createWatchList = async (
  seriesName: string,
  userId: number,
  note: string
) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'No series found',
      };
    }
    const seriesId = Number(series.id);
    const data = { seriesId, userId, note };
    const watchList = await seriesSocialModalCreate.createWatchList(data);
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
    const alreadyFollow = await seriesSocialModalGet.getIsUserFollow(
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
    const follow = await seriesSocialModalCreate.createFollow(data);
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
export const seriesSocialCreate = {
  createReview,
  createLike,
  createComment,
  createWatchList,
  createDisLike,
  createFollow,
  toggleReviewLike,
  toggleReviewDislike,
  toggleCommentLike,
  toggleCommentDislike,
};
const getAllReviewOfSeries = async (seriesName: string) => {
  try {
    // console.log('Series name in the service:', seriesName);
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'Failed find the series',
        data: [],
      };
    }
    // console.log('Series details---', series);
    const seriesId = Number(series.id);
    // console.log('move id get', seriesId);
    const getReview = await seriesSocialModalGet.getReviewOfSeriesByID(seriesId);
    if (!getReview) {
      return {
        success: false,
        message: 'No review found',
        data: [],
      };
    }
    // const getLikeCount = await seriesSocialModalGet.countReviewLike();
    return {
      success: true,
      message: '----All SeriesReview----',
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
    const watchList = await seriesSocialModalGet.getAllWatchList(userId);
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
const getFollowing = async (userId: number) => {
  try {
    const data = await seriesSocialModalGet.getFollowing(userId);

    if (!data) {
      return {
        success: false,
        message: 'No followig data found',
        data: data,
      };
    }
    return {
      success: true,
      message: 'following',
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
      data: [],
    };
  }
};
const getFollower = async (userId: number) => {
  try {
    const data = await seriesSocialModalGet.getFollower(userId);
    if (!data) {
      return {
        success: false,
        message: 'Follower',
        data: data,
      };
    }
    return {
      success: false,
      message: 'follower',
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
      data: [],
    };
  }
};
export const SeriesSocialGet = {
  getAllReviewOfSeries,
  getAllWatchList,
  getFollowing,
  getFollower,
};
const updateSeriesWatchList = async (seriesName: string, userId: number) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'No Series found',
      };
    }
    const seriesId = Number(series.id);
    const updateStatus = await seriesSocialModalUpdate.updateWatchListItem(
      seriesId,
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
const updateReview = async (
  userId: number,
  reviewId: number,
  title?: string,
  content?: string,
  rating?: Ratings,
  isSpoiler?: boolean
) => {
  try {
    const review = await seriesSocialModalGet.getReviewById(reviewId);
    if (!review) {
      return {
        success: false,
        message: 'No review found',
        data: [],
      };
    }
    if (review.userId !== userId) {
      return {
        success: false,
        message: 'Unauthorized: You can only edit your own reviews',
        data: [],
      };
    }
    const update = await seriesSocialModalUpdate.updateReview(
      reviewId,
      title,
      content,
      rating,
      isSpoiler
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the review',
        data: [],
      };
    }
    return {
      success: true,
      message: 'Updated the review',
      data: [update],
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error occurred',
    };
  }
};

const updateComment = async (userId: number, commentId: number, content: string) => {
  try {
    const comment = await seriesSocialModalGet.getCommentById(commentId);
    if (!comment) {
      return { success: false, message: 'No comment found' };
    }
    if (comment.userId !== userId) {
      return { success: false, message: 'Unauthorized: You can only edit your own comments' };
    }
    const update = await seriesSocialModalUpdate.updateComment(commentId, content);
    if (!update) {
      return { success: false, message: 'Failed to update the comment' };
    }
    return { success: true, message: 'SeriesComment updated successfully' };
  } catch (err) {
    return { success: false, message: 'Unexpected error occurred' };
  }
};

export const SeriesSocialUpdate = { updateSeriesWatchList, updateReview, updateComment };
const deleteLike = async (likeId: number) => {
  try {
    const isLiked = await seriesSocialModalGet.getLikedOrNot(likeId);
    if (!isLiked) {
      return {
        success: false,
        message: 'No like found',
      };
    }
    const removeLike = await seriesSocialModalDelete.deleteLike(likeId);
    if (!removeLike) {
      return {
        success: false,
        message: 'Failed to remove the like',
      };
    }
    return {
      success: true,
      message: 'SeriesLike removed',
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
    const isLiked = await seriesSocialModalGet.getDisLikedOrNot(disLikeId);
    if (!isLiked) {
      return {
        success: false,
        message: 'No like found',
      };
    }
    const removeLike = await seriesSocialModalDelete.deleteDisLike(disLikeId);
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
    const doesFollow = await seriesSocialModalGet.getIsUserFollow(
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
    const unfollow = await seriesSocialModalDelete.deleteFollow(followId);
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
      message: 'Unexpected error occurred',
    };
  }
};

const deleteComment = async (userId: number, commentId: number) => {
  try {
    const comment = await seriesSocialModalGet.getCommentById(commentId);
    if (!comment) return { success: false, message: 'SeriesComment not found' };
    if (comment.userId !== userId) return { success: false, message: 'Unauthorized' };

    const del = await seriesSocialModalDelete.deleteComment(commentId);
    if (!del) return { success: false, message: 'Failed to delete the comment' };
    return { success: true, message: 'SeriesComment deleted successfully' };
  } catch (err) {
    return { success: false, message: 'Unexpected error occurred' };
  }
};

export const SeriesSocialDelete = {
  deleteLike,
  deleteDisLike,
  deleteFollowData,
  deleteReview,
  deleteComment,
};
