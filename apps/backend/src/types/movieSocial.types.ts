import { Ratings } from '@prisma/client';

export interface TCreateReview {
  title: string;
  content: string;
  rating: Ratings;
  isSpoiler: boolean;
  userId: number;
  movieId: number;
}
export interface TCreateLike {
  userId: number;
  reviewId: number;
}
export interface TCreateComment {
  content: string;
  userId: number;
  reviewId: number;
  parentId?: number;
}
export interface TWatchListItem {
  userId: number;
  movieId: number;
  addedAt: Date;
  note: string;
}
export interface TFollow {
  followerId: number;
  followingId: number;
  userId?: number;
}
