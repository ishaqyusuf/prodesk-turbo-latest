/*
  Warnings:

  - A unique constraint covering the columns `[squarePaymentId]` on the table `SalesCheckout` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[checkoutId]` on the table `SquarePayments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `SalesCheckout` ADD COLUMN `squarePaymentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SquarePayments` ADD COLUMN `checkoutId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SalesCheckout_squarePaymentId_key` ON `SalesCheckout`(`squarePaymentId`);

-- CreateIndex
CREATE UNIQUE INDEX `SquarePayments_checkoutId_key` ON `SquarePayments`(`checkoutId`);
