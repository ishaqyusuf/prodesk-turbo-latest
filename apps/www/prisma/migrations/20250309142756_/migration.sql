-- AlterTable
ALTER TABLE `SalesCheckout` MODIFY `status` VARCHAR(191) NULL,
    MODIFY `paymentType` VARCHAR(191) NULL,
    MODIFY `amount` DOUBLE NULL,
    MODIFY `orderId` INTEGER NULL;
