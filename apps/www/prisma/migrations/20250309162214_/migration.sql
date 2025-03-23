/*
  Warnings:

  - You are about to drop the column `squareOrderId` on the `CheckoutTenders` table. All the data in the column will be lost.
  - You are about to drop the column `squarePaymentId` on the `CheckoutTenders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CheckoutTenders` DROP COLUMN `squareOrderId`,
    DROP COLUMN `squarePaymentId`;
