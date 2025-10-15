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
      addedAt: data.addedAt,
      note: data.note,
    },
  });
}
async function createFollow(data: TFollow) {
  return await prisma.follow.create({
    data: {
      followerId: data.followerId,
      followingId: data.followingId,
      userId: data.userId,
    },
  });
}
export const movieSocialModalCreate = {
  createComment,
  createFollow,
  createReview,
  createLike,
  createWatchList,
};
