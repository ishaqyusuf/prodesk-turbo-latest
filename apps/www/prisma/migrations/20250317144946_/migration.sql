-- CreateTable
CREATE TABLE `SiteActionTicket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `meta` JSON NULL,
    `deletedAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SiteActionTicket_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
