-- CreateTable
CREATE TABLE `ProductSortIndex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sortIndex` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` TIMESTAMP(0) NULL,
    `dykeStepProductsId` INTEGER NULL,

    UNIQUE INDEX `ProductSortIndex_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
