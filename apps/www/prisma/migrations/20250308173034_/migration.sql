-- CreateTable
CREATE TABLE `SquarePaymentOrders` (
    `id` VARCHAR(191) NOT NULL,
    `squarePaymentId` VARCHAR(191) NULL,

    INDEX `SquarePaymentOrders_squarePaymentId_idx`(`squarePaymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
