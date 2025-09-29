/*
  Warnings:

  - You are about to alter the column `budget` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `revenue` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `updatedAt` to the `login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `login` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `movies` ADD COLUMN `trailerLink` VARCHAR(191) NULL,
    MODIFY `budget` INTEGER NULL,
    MODIFY `revenue` INTEGER NULL;
