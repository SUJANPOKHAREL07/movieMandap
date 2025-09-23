-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `udpatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `otpVerify` VARCHAR(191) NULL DEFAULT '',
    `otpExpired` DATETIME(3) NULL,
    `updateOtp` VARCHAR(191) NULL,
    `updateOtpExpire` DATETIME(3) NULL,
    `resetOtp` VARCHAR(191) NULL DEFAULT '',
    `resetOtpExpired` DATETIME(3) NULL,
    `role` ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_email_id_key`(`email`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `useremail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'moderator', 'admin') NOT NULL,
    `refresh_token` VARCHAR(1000) NOT NULL,

    UNIQUE INDEX `login_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movies` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `originalTitle` VARCHAR(191) NULL,
    `overview` VARCHAR(191) NULL,
    `releaseDate` DATETIME(3) NULL,
    `runtime` INTEGER NULL,
    `posterPath` VARCHAR(191) NULL,
    `budget` BIGINT NULL,
    `revenue` BIGINT NULL,
    `status` ENUM('release', 'upcomming') NOT NULL DEFAULT 'upcomming',
    `tagline` VARCHAR(191) NULL,
    `adult` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `login` ADD CONSTRAINT `login_useremail_userId_fkey` FOREIGN KEY (`useremail`, `userId`) REFERENCES `user`(`email`, `id`) ON DELETE RESTRICT ON UPDATE CASCADE;
