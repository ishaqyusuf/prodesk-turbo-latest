/*
  Warnings:

  - Added the required column `orderId` to the `SquarePaymentOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SquarePaymentOrders` ADD COLUMN `orderId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `SquarePaymentOrders_orderId_idx` ON `SquarePaymentOrders`(`orderId`);
