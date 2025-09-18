-- AlterTable
ALTER TABLE `user` ADD COLUMN `otpExpired` DATETIME(3) NULL,
    ADD COLUMN `otpVerify` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `resetOtp` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `resetOtpExpired` DATETIME(3) NULL,
    ADD COLUMN `role` ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',
    ADD COLUMN `updateOtp` VARCHAR(191) NULL,
    ADD COLUMN `updateOtpExpire` DATETIME(3) NULL,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;
