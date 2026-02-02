/*
  Warnings:

  - The primary key for the `movie_genere` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `movie_genere` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `generesId` on the `movie_genere` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `productionId` on the `movie_production_companies` table. All the data in the column will be lost.
  - You are about to drop the column `originCOuntry` on the `production_companies` table. All the data in the column will be lost.
  - You are about to drop the `generes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `peoples` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId,personId,character]` on the table `cast_member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,reviewId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId,conpanyId]` on the table `movie_production_companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId]` on the table `watchlist_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conpanyId` to the `movie_production_companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cast_member` DROP FOREIGN KEY `cast_member_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `cast_member` DROP FOREIGN KEY `cast_member_personId_fkey`;

-- DropForeignKey
ALTER TABLE `crew_member` DROP FOREIGN KEY `crew_member_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `crew_member` DROP FOREIGN KEY `crew_member_personId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `login` DROP FOREIGN KEY `login_useremail_userId_fkey`;

-- DropForeignKey
ALTER TABLE `movie_genere` DROP FOREIGN KEY `movie_genere_generesId_fkey`;

-- DropForeignKey
ALTER TABLE `movie_genere` DROP FOREIGN KEY `movie_genere_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `movie_production_companies` DROP FOREIGN KEY `movie_production_companies_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `movie_production_companies` DROP FOREIGN KEY `movie_production_companies_productionId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_movieId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userId_fkey`;

-- DropIndex
DROP INDEX `Follow_userId_fkey` ON `Follow`;

-- DropIndex
DROP INDEX `cast_member_movieId_fkey` ON `cast_member`;

-- DropIndex
DROP INDEX `cast_member_personId_fkey` ON `cast_member`;

-- DropIndex
DROP INDEX `crew_member_personId_fkey` ON `crew_member`;

-- DropIndex
DROP INDEX `likes_reviewId_fkey` ON `likes`;

-- DropIndex
DROP INDEX `likes_userId_fkey` ON `likes`;

-- DropIndex
DROP INDEX `login_useremail_userId_fkey` ON `login`;

-- DropIndex
DROP INDEX `movie_genere_generesId_fkey` ON `movie_genere`;

-- DropIndex
DROP INDEX `movie_production_companies_movieId_productionId_key` ON `movie_production_companies`;

-- DropIndex
DROP INDEX `movie_production_companies_productionId_fkey` ON `movie_production_companies`;

-- DropIndex
DROP INDEX `reviews_movieId_fkey` ON `reviews`;

-- DropIndex
DROP INDEX `reviews_userId_fkey` ON `reviews`;

-- AlterTable
ALTER TABLE `cast_member` MODIFY `creditId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `movie_genere` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `generesId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `movie_production_companies` DROP COLUMN `productionId`,
    ADD COLUMN `conpanyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `production_companies` DROP COLUMN `originCOuntry`,
    ADD COLUMN `originCountry` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `watchlist_items` ADD COLUMN `status` ENUM('Watched', 'Yet_To_Watch') NOT NULL DEFAULT 'Yet_To_Watch';

-- DropTable
DROP TABLE `generes`;

-- DropTable
DROP TABLE `peoples`;

-- CreateTable
CREATE TABLE `genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `genres_name_key`(`name`),
    UNIQUE INDEX `genres_id_name_key`(`id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `people` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `birthDay` DATETIME(3) NOT NULL,
    `deathDay` DATETIME(3) NULL,
    `birthPlace` VARCHAR(191) NULL,
    `socialPath` VARCHAR(191) NULL,
    `adult` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dislikes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dislikes_userId_reviewId_key`(`userId`, `reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Follow_followerId_followingId_key` ON `Follow`(`followerId`, `followingId`);

-- CreateIndex
CREATE UNIQUE INDEX `cast_member_movieId_personId_character_key` ON `cast_member`(`movieId`, `personId`, `character`);

-- CreateIndex
CREATE UNIQUE INDEX `likes_userId_reviewId_key` ON `likes`(`userId`, `reviewId`);

-- CreateIndex
CREATE UNIQUE INDEX `movie_production_companies_movieId_conpanyId_key` ON `movie_production_companies`(`movieId`, `conpanyId`);

-- CreateIndex
CREATE UNIQUE INDEX `reviews_userId_movieId_key` ON `reviews`(`userId`, `movieId`);

-- CreateIndex
CREATE UNIQUE INDEX `watchlist_items_userId_movieId_key` ON `watchlist_items`(`userId`, `movieId`);

-- AddForeignKey
ALTER TABLE `login` ADD CONSTRAINT `login_useremail_userId_fkey` FOREIGN KEY (`useremail`, `userId`) REFERENCES `user`(`email`, `id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_genere` ADD CONSTRAINT `movie_genere_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_genere` ADD CONSTRAINT `movie_genere_generesId_fkey` FOREIGN KEY (`generesId`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_production_companies` ADD CONSTRAINT `movie_production_companies_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_production_companies` ADD CONSTRAINT `movie_production_companies_conpanyId_fkey` FOREIGN KEY (`conpanyId`) REFERENCES `production_companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crew_member` ADD CONSTRAINT `crew_member_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crew_member` ADD CONSTRAINT `crew_member_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `people`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cast_member` ADD CONSTRAINT `cast_member_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cast_member` ADD CONSTRAINT `cast_member_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `people`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dislikes` ADD CONSTRAINT `dislikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dislikes` ADD CONSTRAINT `dislikes_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
