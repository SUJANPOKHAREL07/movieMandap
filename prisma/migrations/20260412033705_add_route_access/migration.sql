-- CreateTable
CREATE TABLE `route_access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeId` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'moderator', 'admin') NOT NULL,
    `allowed` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `route_access_routeId_role_key`(`routeId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
