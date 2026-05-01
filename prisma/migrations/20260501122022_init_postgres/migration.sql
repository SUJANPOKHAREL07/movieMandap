-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "public"."movieStatus" AS ENUM ('RELEASED', 'IN_PRODUCTION', 'POST_PRODUCTION', 'PLANNED', 'CANCELLED', 'RUMORED');

-- CreateEnum
CREATE TYPE "public"."Ratings" AS ENUM ('Worst', 'Bearable', 'Good_To_Watch', 'Worthy', 'Absolute_Cinema');

-- CreateEnum
CREATE TYPE "public"."watchStatus" AS ENUM ('Watched', 'Yet_To_Watch');

-- CreateEnum
CREATE TYPE "public"."seriesStatus" AS ENUM ('RELEASED', 'IN_PRODUCTION', 'POST_PRODUCTION', 'PLANNED', 'CANCELLED', 'RUMORED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "udpatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otpVerify" TEXT DEFAULT '',
    "otpExpired" TIMESTAMP(3),
    "updateOtp" TEXT,
    "updateOtpExpire" TIMESTAMP(3),
    "resetOtp" TEXT DEFAULT '',
    "resetOtpExpired" TIMESTAMP(3),
    "role" "public"."Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "useremail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "overview" TEXT,
    "releaseDate" TIMESTAMP(3),
    "runtime" INTEGER,
    "posterPath" TEXT,
    "budget" INTEGER,
    "revenue" INTEGER,
    "status" "public"."movieStatus" NOT NULL DEFAULT 'IN_PRODUCTION',
    "tagline" TEXT,
    "adult" BOOLEAN NOT NULL DEFAULT false,
    "trailerLink" TEXT,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie_genere" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "generesId" INTEGER NOT NULL,

    CONSTRAINT "movie_genere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT,
    "originCountry" TEXT,

    CONSTRAINT "production_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie_production_companies" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "conpanyId" INTEGER NOT NULL,

    CONSTRAINT "movie_production_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."people" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDay" TIMESTAMP(3) NOT NULL,
    "deathDay" TIMESTAMP(3),
    "birthPlace" TEXT,
    "socialPath" TEXT,
    "adult" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."crew_member" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "job" TEXT NOT NULL,

    CONSTRAINT "crew_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cast_member" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,

    CONSTRAINT "cast_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" "public"."Ratings" NOT NULL DEFAULT 'Good_To_Watch',
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "creadtedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment_dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."watchlist_items" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "status" "public"."watchStatus" NOT NULL DEFAULT 'Yet_To_Watch',

    CONSTRAINT "watchlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Follow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."route_access" (
    "id" SERIAL NOT NULL,
    "routeId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "route_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "overview" TEXT,
    "releaseDate" TIMESTAMP(3),
    "runtime" INTEGER,
    "posterPath" TEXT,
    "trailerLink" TEXT,
    "budget" INTEGER,
    "revenue" INTEGER,
    "status" "public"."seriesStatus" NOT NULL DEFAULT 'IN_PRODUCTION',
    "tagline" TEXT,
    "adult" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seasons" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "title" TEXT,
    "overview" TEXT,
    "airDate" TIMESTAMP(3),
    "episodeCount" INTEGER NOT NULL DEFAULT 0,
    "posterPath" TEXT,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."episodes" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT,
    "overview" TEXT,
    "airDate" TIMESTAMP(3),
    "runtime" INTEGER,
    "posterPath" TEXT,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_reviews" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" "public"."Ratings" NOT NULL DEFAULT 'Good_To_Watch',
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "season_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "season_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "season_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_comment_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "season_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."season_comment_dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "season_comment_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_genere" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "generesId" INTEGER NOT NULL,

    CONSTRAINT "series_genere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_production_companies" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "conpanyId" INTEGER NOT NULL,

    CONSTRAINT "series_production_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_crew_member" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "job" TEXT NOT NULL,

    CONSTRAINT "series_crew_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_cast_member" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,

    CONSTRAINT "series_cast_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_reviews" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" "public"."Ratings" NOT NULL DEFAULT 'Good_To_Watch',
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "creadtedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,

    CONSTRAINT "series_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_comment_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "series_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_comment_dislikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "series_comment_dislikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_watchlist_items" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "status" "public"."watchStatus" NOT NULL DEFAULT 'Yet_To_Watch',

    CONSTRAINT "series_watchlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_id_key" ON "public"."users"("email", "id");

-- CreateIndex
CREATE INDEX "login_useremail_userId_idx" ON "public"."login"("useremail", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "public"."movies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "movies_id_title_key" ON "public"."movies"("id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "public"."genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_id_name_key" ON "public"."genres"("id", "name");

-- CreateIndex
CREATE INDEX "movie_genere_generesId_idx" ON "public"."movie_genere"("generesId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_genere_movieId_generesId_key" ON "public"."movie_genere"("movieId", "generesId");

-- CreateIndex
CREATE UNIQUE INDEX "production_companies_id_name_key" ON "public"."production_companies"("id", "name");

-- CreateIndex
CREATE INDEX "movie_production_companies_conpanyId_idx" ON "public"."movie_production_companies"("conpanyId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_production_companies_movieId_conpanyId_key" ON "public"."movie_production_companies"("movieId", "conpanyId");

-- CreateIndex
CREATE INDEX "crew_member_personId_idx" ON "public"."crew_member"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "crew_member_movieId_personId_job_key" ON "public"."crew_member"("movieId", "personId", "job");

-- CreateIndex
CREATE INDEX "cast_member_personId_idx" ON "public"."cast_member"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "cast_member_movieId_personId_character_key" ON "public"."cast_member"("movieId", "personId", "character");

-- CreateIndex
CREATE INDEX "reviews_movieId_idx" ON "public"."reviews"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_movieId_key" ON "public"."reviews"("userId", "movieId");

-- CreateIndex
CREATE INDEX "likes_reviewId_idx" ON "public"."likes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_reviewId_key" ON "public"."likes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "dislikes_reviewId_idx" ON "public"."dislikes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "dislikes_userId_reviewId_key" ON "public"."dislikes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "public"."comments"("parentId");

-- CreateIndex
CREATE INDEX "comments_reviewId_idx" ON "public"."comments"("reviewId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "public"."comments"("userId");

-- CreateIndex
CREATE INDEX "comment_likes_commentId_idx" ON "public"."comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_userId_commentId_key" ON "public"."comment_likes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "comment_dislikes_commentId_idx" ON "public"."comment_dislikes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_dislikes_userId_commentId_key" ON "public"."comment_dislikes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "watchlist_items_movieId_idx" ON "public"."watchlist_items"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_items_userId_movieId_key" ON "public"."watchlist_items"("userId", "movieId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "public"."Follow"("followingId");

-- CreateIndex
CREATE INDEX "Follow_userId_idx" ON "public"."Follow"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "public"."Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "route_access_routeId_role_key" ON "public"."route_access"("routeId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "series_title_key" ON "public"."series"("title");

-- CreateIndex
CREATE UNIQUE INDEX "series_id_title_key" ON "public"."series"("id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_seriesId_seasonNumber_key" ON "public"."seasons"("seriesId", "seasonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_seasonId_episodeNumber_key" ON "public"."episodes"("seasonId", "episodeNumber");

-- CreateIndex
CREATE INDEX "season_reviews_seasonId_idx" ON "public"."season_reviews"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "season_reviews_userId_seasonId_key" ON "public"."season_reviews"("userId", "seasonId");

-- CreateIndex
CREATE INDEX "season_likes_reviewId_idx" ON "public"."season_likes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "season_likes_userId_reviewId_key" ON "public"."season_likes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "season_dislikes_reviewId_idx" ON "public"."season_dislikes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "season_dislikes_userId_reviewId_key" ON "public"."season_dislikes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "season_comments_parentId_idx" ON "public"."season_comments"("parentId");

-- CreateIndex
CREATE INDEX "season_comments_reviewId_idx" ON "public"."season_comments"("reviewId");

-- CreateIndex
CREATE INDEX "season_comments_userId_idx" ON "public"."season_comments"("userId");

-- CreateIndex
CREATE INDEX "season_comment_likes_commentId_idx" ON "public"."season_comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "season_comment_likes_userId_commentId_key" ON "public"."season_comment_likes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "season_comment_dislikes_commentId_idx" ON "public"."season_comment_dislikes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "season_comment_dislikes_userId_commentId_key" ON "public"."season_comment_dislikes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "series_genere_generesId_idx" ON "public"."series_genere"("generesId");

-- CreateIndex
CREATE UNIQUE INDEX "series_genere_seriesId_generesId_key" ON "public"."series_genere"("seriesId", "generesId");

-- CreateIndex
CREATE INDEX "series_production_companies_conpanyId_idx" ON "public"."series_production_companies"("conpanyId");

-- CreateIndex
CREATE UNIQUE INDEX "series_production_companies_seriesId_conpanyId_key" ON "public"."series_production_companies"("seriesId", "conpanyId");

-- CreateIndex
CREATE INDEX "series_crew_member_personId_idx" ON "public"."series_crew_member"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "series_crew_member_seriesId_personId_job_key" ON "public"."series_crew_member"("seriesId", "personId", "job");

-- CreateIndex
CREATE INDEX "series_cast_member_personId_idx" ON "public"."series_cast_member"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "series_cast_member_seriesId_personId_character_key" ON "public"."series_cast_member"("seriesId", "personId", "character");

-- CreateIndex
CREATE INDEX "series_reviews_seriesId_idx" ON "public"."series_reviews"("seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "series_reviews_userId_seriesId_key" ON "public"."series_reviews"("userId", "seriesId");

-- CreateIndex
CREATE INDEX "series_likes_reviewId_idx" ON "public"."series_likes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "series_likes_userId_reviewId_key" ON "public"."series_likes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "series_dislikes_reviewId_idx" ON "public"."series_dislikes"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "series_dislikes_userId_reviewId_key" ON "public"."series_dislikes"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "series_comments_parentId_idx" ON "public"."series_comments"("parentId");

-- CreateIndex
CREATE INDEX "series_comments_reviewId_idx" ON "public"."series_comments"("reviewId");

-- CreateIndex
CREATE INDEX "series_comments_userId_idx" ON "public"."series_comments"("userId");

-- CreateIndex
CREATE INDEX "series_comment_likes_commentId_idx" ON "public"."series_comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "series_comment_likes_userId_commentId_key" ON "public"."series_comment_likes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "series_comment_dislikes_commentId_idx" ON "public"."series_comment_dislikes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "series_comment_dislikes_userId_commentId_key" ON "public"."series_comment_dislikes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "series_watchlist_items_seriesId_idx" ON "public"."series_watchlist_items"("seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "series_watchlist_items_userId_seriesId_key" ON "public"."series_watchlist_items"("userId", "seriesId");

-- AddForeignKey
ALTER TABLE "public"."login" ADD CONSTRAINT "login_useremail_userId_fkey" FOREIGN KEY ("useremail", "userId") REFERENCES "public"."users"("email", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_genere" ADD CONSTRAINT "movie_genere_generesId_fkey" FOREIGN KEY ("generesId") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_genere" ADD CONSTRAINT "movie_genere_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_production_companies" ADD CONSTRAINT "movie_production_companies_conpanyId_fkey" FOREIGN KEY ("conpanyId") REFERENCES "public"."production_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_production_companies" ADD CONSTRAINT "movie_production_companies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crew_member" ADD CONSTRAINT "crew_member_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crew_member" ADD CONSTRAINT "crew_member_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cast_member" ADD CONSTRAINT "cast_member_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cast_member" ADD CONSTRAINT "cast_member_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dislikes" ADD CONSTRAINT "dislikes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dislikes" ADD CONSTRAINT "dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_likes" ADD CONSTRAINT "comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_dislikes" ADD CONSTRAINT "comment_dislikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_dislikes" ADD CONSTRAINT "comment_dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watchlist_items" ADD CONSTRAINT "watchlist_items_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watchlist_items" ADD CONSTRAINT "watchlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seasons" ADD CONSTRAINT "seasons_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."episodes" ADD CONSTRAINT "episodes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_reviews" ADD CONSTRAINT "season_reviews_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_reviews" ADD CONSTRAINT "season_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_likes" ADD CONSTRAINT "season_likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."season_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_likes" ADD CONSTRAINT "season_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_dislikes" ADD CONSTRAINT "season_dislikes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."season_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_dislikes" ADD CONSTRAINT "season_dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comments" ADD CONSTRAINT "season_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."season_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comments" ADD CONSTRAINT "season_comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."season_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comments" ADD CONSTRAINT "season_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comment_likes" ADD CONSTRAINT "season_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."season_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comment_likes" ADD CONSTRAINT "season_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comment_dislikes" ADD CONSTRAINT "season_comment_dislikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."season_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."season_comment_dislikes" ADD CONSTRAINT "season_comment_dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_genere" ADD CONSTRAINT "series_genere_generesId_fkey" FOREIGN KEY ("generesId") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_genere" ADD CONSTRAINT "series_genere_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_production_companies" ADD CONSTRAINT "series_production_companies_conpanyId_fkey" FOREIGN KEY ("conpanyId") REFERENCES "public"."production_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_production_companies" ADD CONSTRAINT "series_production_companies_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_crew_member" ADD CONSTRAINT "series_crew_member_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_crew_member" ADD CONSTRAINT "series_crew_member_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_cast_member" ADD CONSTRAINT "series_cast_member_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_cast_member" ADD CONSTRAINT "series_cast_member_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_reviews" ADD CONSTRAINT "series_reviews_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_reviews" ADD CONSTRAINT "series_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_likes" ADD CONSTRAINT "series_likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."series_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_likes" ADD CONSTRAINT "series_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_dislikes" ADD CONSTRAINT "series_dislikes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."series_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_dislikes" ADD CONSTRAINT "series_dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comments" ADD CONSTRAINT "series_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."series_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comments" ADD CONSTRAINT "series_comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."series_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comments" ADD CONSTRAINT "series_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comment_likes" ADD CONSTRAINT "series_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."series_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comment_likes" ADD CONSTRAINT "series_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comment_dislikes" ADD CONSTRAINT "series_comment_dislikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."series_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_comment_dislikes" ADD CONSTRAINT "series_comment_dislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_watchlist_items" ADD CONSTRAINT "series_watchlist_items_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_watchlist_items" ADD CONSTRAINT "series_watchlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
