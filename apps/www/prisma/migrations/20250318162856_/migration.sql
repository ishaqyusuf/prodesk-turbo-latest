-- CreateTable
CREATE TABLE `SiteActionNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL,
    `meta` JSON NULL,
    `deletedAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SiteActionNotification_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
