import { Ratings } from '@prisma/client';
import prisma from '../prisma/client';
import {
  TCreateComment,
  TCreateLike,
  TCreateReview,
  TFollow,
  TWatchListItem,
} from '../types/movieSocial.types';

async function createReview(data: TCreateReview) {
  return await prisma.review.create({
    data: {
      title: data.title,
      content: data.content,
      rating: data.rating,
      isSpoiler: data.isSpoiler,
      userId: data.userId,
      movieId: data.movieId,
    },
  });
}
async function createLike(data: TCreateLike) {
  return await prisma.like.create({
    data: {
      userId: data.userId,
      reviewId: data.reviewId,
    },
  });
}
async function createDislike(data: TCreateLike) {
  return await prisma.dislike.create({
    data: {
      userId: data.userId,
      reviewId: data.reviewId,
    },
  });
}
async function createComment(data: TCreateComment) {
  return await prisma.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      reviewId: data.reviewId,
      parentId: data.parentId,
    },
  });
}
async function createWatchList(data: TWatchListItem) {
  return await prisma.watchlistItem.create({
    data: {
      userId: data.userId,
      movieId: data.movieId,
      note: data.note,
    },
  });
}
async function createFollow(data: TFollow) {
  console.log(data);
  return await prisma.follow.create({
    data: {
      followerId: data.followerId,
      followingId: data.followingId,
    },
  });
}
export const movieSocialModalCreate = {
  createComment,
  createFollow,
  createReview,
  createLike,
  createWatchList,
  createDislike,
};
async function getReviewOfMovieByID(movieId: number) {
  const data = await prisma.review.findMany({
    where: {
      movieId: movieId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      Comment: {
        where: {
          parentId: null, // Only get top-level comments
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      Like: true, // Include likes to count them
      _count: {
        select: {
          Like: true,
          Dislike: true,
          Comment: true,
        },
      },
    },
    orderBy: {
      creadtedAt: 'asc',
    },
  });

  console.log('Fetched review data:', JSON.stringify(data, null, 2));
  return data;
}

// Helper function to get like count for a specific review
async function getReviewLikeCount(reviewId: number) {
  return await prisma.like.count({
    where: {
      reviewId: reviewId,
    },
  });
}

// Helper function to get comment count for a specific review
async function getReviewCommentCount(reviewId: number) {
  return await prisma.comment.count({
    where: {
      reviewId: reviewId,
    },
  });
}
async function getAllWatchList(userId: number) {
  return await prisma.watchlistItem.findMany({
    where: {
      userId: userId,
    },
    include: {
      movie: true,
    },
  });
}
async function getLikedOrNot(likeId: number) {
  const data = await prisma.like.findUnique({
    where: {
      id: likeId,
    },
  });
  console.log(data);
  return data;
}
async function getDisLikedOrNot(disLikeId: number) {
  const data = await prisma.dislike.findUnique({
    where: {
      id: disLikeId,
    },
  });
  console.log(data);
  return data;
}
async function getIsUserFollow(followerId: number, followingId: number) {
  const data = await prisma.follow.findFirst({
    where: {
      followerId: followerId,
      followingId: followingId,
    },
  });
  // console.log('in the modal', data);
  return data;
}
async function getFollowing(followerId: number) {
  return await prisma.follow.count({
    where: {
      followerId: followerId,
    },
  });
}
async function getFollower(followingId: number) {
  return await prisma.follow.count({
    where: {
      followingId: followingId,
    },
  });
}
export const movieSocialModalGet = {
  getReviewOfMovieByID,
  getReviewCommentCount,
  getReviewLikeCount,
  getAllWatchList,
  getLikedOrNot,
  getDisLikedOrNot,
  getIsUserFollow,
  getFollowing,
  getFollower,
};
async function updateWatchListItem(movieId: number, userId: number) {
  return await prisma.watchlistItem.updateMany({
    where: {
      movieId: movieId,
      userId: userId,
    },
    data: {
      status: 'Watched',
    },
  });
}
async function updateReview(
  reviewId: number,
  title?: string,
  content?: string,
  rating?: Ratings,
  isSpoiler?: boolean
) {
  return await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      rating: rating,
      title: title,
      content: content,
      isSpoiler: isSpoiler,
    },
  });
}
export const movieSocialModalUpdate = {
  updateWatchListItem,
  updateReview,
};
async function deleteReview(reviewId: number) {
  return await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
}
async function deleteLike(likeId: number) {
  return await prisma.like.delete({
    where: {
      id: likeId,
    },
  });
}
async function deleteDisLike(disLikeId: number) {
  return await prisma.dislike.delete({
    where: {
      id: disLikeId,
    },
  });
}
async function deleteFollow(followId: number) {
  return await prisma.follow.delete({
    where: {
      id: followId,
    },
  });
}
export const movieSocialModalDelete = {
  deleteLike,
  deleteDisLike,
  deleteFollow,
  deleteReview,
};
