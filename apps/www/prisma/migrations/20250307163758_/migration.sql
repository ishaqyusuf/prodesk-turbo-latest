-- CreateTable
CREATE TABLE `SalesExtraCosts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `taxxable` BOOLEAN NULL,
    `amount` DOUBLE NOT NULL,
    `tax` DOUBLE NULL,
    `totalAmount` DOUBLE NULL,
    `orderId` INTEGER NOT NULL,

    UNIQUE INDEX `SalesExtraCosts_id_key`(`id`),
    INDEX `SalesExtraCosts_orderId_idx`(`orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
