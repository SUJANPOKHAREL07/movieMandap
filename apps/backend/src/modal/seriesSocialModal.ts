import { Ratings } from '@prisma/client';
import prisma from '../prisma/client';
import {
  TCreateComment,
  TCreateLike,
  TCreateReview,
  TFollow,
  TWatchListItem,
} from '../types/seriesSocial.types';

async function createReview(data: TCreateReview) {
  return await prisma.seriesReview.create({
    data: {
      title: data.title,
      content: data.content,
      rating: data.rating,
      isSpoiler: data.isSpoiler,
      userId: data.userId,
      seriesId: data.seriesId,
    },
  });
}
async function createLike(data: TCreateLike) {
  return await prisma.seriesLike.create({
    data: {
      userId: data.userId,
      reviewId: data.reviewId,
    },
  });
}
async function createDislike(data: TCreateLike) {
  return await prisma.seriesDislike.create({
    data: {
      userId: data.userId,
      reviewId: data.reviewId,
    },
  });
}
async function createComment(data: TCreateComment) {
  return await prisma.seriesComment.create({
    data: {
      content: data.content,
      userId: data.userId,
      reviewId: data.reviewId,
      parentId: data.parentId,
    },
  });
}
async function createWatchList(data: TWatchListItem) {
  return await prisma.seriesWatchlistItem.create({
    data: {
      userId: data.userId,
      seriesId: data.seriesId,
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

async function toggleCommentLike(userId: number, commentId: number) {
  const existing = await prisma.seriesCommentLike.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.seriesCommentLike.delete({ where: { id: existing.id } });
    return { success: true, message: 'SeriesLike removed' };
  }

  await prisma.seriesCommentDislike.deleteMany({ where: { userId, commentId } });
  await prisma.seriesCommentLike.create({ data: { userId, commentId } });
  return { success: true, message: 'SeriesComment liked' };
}

async function toggleCommentDislike(userId: number, commentId: number) {
  const existing = await prisma.seriesCommentDislike.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.seriesCommentDislike.delete({ where: { id: existing.id } });
    return { success: true, message: 'SeriesDislike removed' };
  }

  await prisma.seriesCommentLike.deleteMany({ where: { userId, commentId } });
  await prisma.seriesCommentDislike.create({ data: { userId, commentId } });
  return { success: true, message: 'SeriesComment disliked' };
}

// SeriesReview Interaction Toggles
async function toggleReviewLike(userId: number, reviewId: number) {
  const existing = await prisma.seriesLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (existing) {
    await prisma.seriesLike.delete({ where: { id: existing.id } });
    return { success: true, message: 'SeriesLike removed' };
  }

  await prisma.seriesDislike.deleteMany({ where: { userId, reviewId } });
  await prisma.seriesLike.create({ data: { userId, reviewId } });
  return { success: true, message: 'SeriesReview liked' };
}

async function toggleReviewDislike(userId: number, reviewId: number) {
  const existing = await prisma.seriesDislike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (existing) {
    await prisma.seriesDislike.delete({ where: { id: existing.id } });
    return { success: true, message: 'SeriesDislike removed' };
  }

  await prisma.seriesLike.deleteMany({ where: { userId, reviewId } });
  await prisma.seriesDislike.create({ data: { userId, reviewId } });
  return { success: true, message: 'SeriesReview disliked' };
}

export const seriesSocialModalCreate = {
  createComment,
  createFollow,
  createReview,
  createLike,
  createWatchList,
  createDislike,
  toggleCommentLike,
  toggleCommentDislike,
  toggleReviewLike,
  toggleReviewDislike,
};
async function getReviewOfSeriesByID(seriesId: number, userId?: number) {
  const data = await prisma.seriesReview.findMany({
    where: {
      seriesId: seriesId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      SeriesComment: {
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
          SeriesCommentLike: true,
          SeriesCommentDislike: true,
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              SeriesCommentLike: true,
              SeriesCommentDislike: true,
              replies: { // Add another level of replies if needed
                include: {
                  user: { select: { id: true, username: true } },
                  SeriesCommentLike: true,
                  SeriesCommentDislike: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              SeriesCommentLike: true,
              SeriesCommentDislike: true,
              replies: true,
            }
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      SeriesLike: true,
      SeriesDislike: true,
      _count: {
        select: {
          SeriesLike: true,
          SeriesDislike: true,
          SeriesComment: true,
        },
      },
    },
    orderBy: {
      SeriesLike: {
        _count: 'desc',
      },
    },
  });

  return data;
}

// Helper function to get like count for a specific review
async function getReviewLikeCount(reviewId: number) {
  return await prisma.seriesLike.count({
    where: {
      reviewId: reviewId,
    },
  });
}

// Helper function to get comment count for a specific review
async function getReviewCommentCount(reviewId: number) {
  return await prisma.seriesComment.count({
    where: {
      reviewId: reviewId,
    },
  });
}
async function getReviewById(reviewId: number) {
  return await prisma.seriesReview.findUnique({
    where: { id: reviewId },
  });
}
async function getCommentById(commentId: number) {
  return await prisma.seriesComment.findUnique({
    where: { id: commentId },
  });
}
async function getAllWatchList(userId: number) {
  return await prisma.seriesWatchlistItem.findMany({
    where: {
      userId: userId,
    },
    include: {
      series: true,
    },
  });
}
async function getLikedOrNot(likeId: number) {
  const data = await prisma.seriesLike.findUnique({
    where: {
      id: likeId,
    },
  });
  console.log(data);
  return data;
}
async function getDisLikedOrNot(disLikeId: number) {
  const data = await prisma.seriesDislike.findUnique({
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
export const seriesSocialModalGet = {
  getReviewOfSeriesByID,
  getReviewCommentCount,
  getReviewLikeCount,
  getAllWatchList,
  getLikedOrNot,
  getDisLikedOrNot,
  getIsUserFollow,
  getFollowing,
  getFollower,
  getReviewById,
  getCommentById,
};
async function updateWatchListItem(seriesId: number, userId: number) {
  return await prisma.seriesWatchlistItem.updateMany({
    where: {
      seriesId: seriesId,
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
  return await prisma.seriesReview.update({
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

async function updateComment(commentId: number, content: string) {
  return await prisma.seriesComment.update({
    where: { id: commentId },
    data: { content },
  });
}

export const seriesSocialModalUpdate = {
  updateWatchListItem,
  updateReview,
  updateComment,
};
async function deleteReview(reviewId: number) {
  return await prisma.seriesReview.delete({
    where: {
      id: reviewId,
    },
  });
}

async function deleteComment(commentId: number) {
  return await prisma.seriesComment.delete({
    where: { id: commentId },
  });
}
async function deleteLike(likeId: number) {
  return await prisma.seriesLike.delete({
    where: {
      id: likeId,
    },
  });
}
async function deleteDisLike(disLikeId: number) {
  return await prisma.seriesDislike.delete({
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
export const seriesSocialModalDelete = {
  deleteLike,
  deleteDisLike,
  deleteFollow,
  deleteReview,
  deleteComment,
};
