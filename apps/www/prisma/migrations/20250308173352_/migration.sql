/*
  Warnings:

  - Made the column `squarePaymentId` on table `SquarePaymentOrders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SquarePaymentOrders` MODIFY `squarePaymentId` VARCHAR(191) NOT NULL;
