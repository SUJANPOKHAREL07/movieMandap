/*
  Warnings:

  - You are about to drop the column `email` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `login` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refresh_token]` on the table `login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useremail` to the `login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `login` DROP COLUMN `email`,
    DROP COLUMN `username`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    ADD COLUMN `useremail` VARCHAR(191) NOT NULL,
    MODIFY `refresh_token` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `login_refresh_token_key` ON `login`(`refresh_token`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_id_key` ON `user`(`email`, `id`);

-- AddForeignKey
ALTER TABLE `login` ADD CONSTRAINT `login_useremail_userId_fkey` FOREIGN KEY (`useremail`, `userId`) REFERENCES `user`(`email`, `id`) ON DELETE RESTRICT ON UPDATE CASCADE;
