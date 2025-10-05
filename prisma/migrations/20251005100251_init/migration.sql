/*
  Warnings:

  - The primary key for the `login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `login` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `login` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `movies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[title]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,title]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `login` DROP FOREIGN KEY `login_useremail_userId_fkey`;

-- DropIndex
DROP INDEX `login_useremail_userId_fkey` ON `login`;

-- AlterTable
ALTER TABLE `login` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `movies` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `generes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `generes_name_key`(`name`),
    UNIQUE INDEX `generes_id_name_key`(`id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_genere` (
    `id` VARCHAR(191) NOT NULL,
    `movieId` INTEGER NOT NULL,
    `generesId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `movie_genere_movieId_generesId_key`(`movieId`, `generesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `logoPath` VARCHAR(191) NULL,
    `originCOuntry` VARCHAR(191) NULL,

    UNIQUE INDEX `production_companies_id_name_key`(`id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_production_companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `productionId` INTEGER NOT NULL,

    UNIQUE INDEX `movie_production_companies_movieId_productionId_key`(`movieId`, `productionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peoples` (
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
CREATE TABLE `crew_member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `personId` INTEGER NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `job` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `crew_member_movieId_personId_job_key`(`movieId`, `personId`, `job`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cast_member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `personId` INTEGER NOT NULL,
    `character` VARCHAR(191) NOT NULL,
    `creditId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `rating` ENUM('Worst', 'Bearable', 'Good_To_Watch', 'Worthy', 'Absolute_Cinema') NOT NULL DEFAULT 'Good_To_Watch',
    `isSpoiler` BOOLEAN NOT NULL DEFAULT false,
    `creadtedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `watchlist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `movieId` INTEGER NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `movies_title_key` ON `movies`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `movies_id_title_key` ON `movies`(`id`, `title`);

-- AddForeignKey
ALTER TABLE `login` ADD CONSTRAINT `login_useremail_userId_fkey` FOREIGN KEY (`useremail`, `userId`) REFERENCES `user`(`email`, `id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_genere` ADD CONSTRAINT `movie_genere_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_genere` ADD CONSTRAINT `movie_genere_generesId_fkey` FOREIGN KEY (`generesId`) REFERENCES `generes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_production_companies` ADD CONSTRAINT `movie_production_companies_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_production_companies` ADD CONSTRAINT `movie_production_companies_productionId_fkey` FOREIGN KEY (`productionId`) REFERENCES `production_companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crew_member` ADD CONSTRAINT `crew_member_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crew_member` ADD CONSTRAINT `crew_member_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `peoples`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cast_member` ADD CONSTRAINT `cast_member_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cast_member` ADD CONSTRAINT `cast_member_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `peoples`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlist_items` ADD CONSTRAINT `watchlist_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlist_items` ADD CONSTRAINT `watchlist_items_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
