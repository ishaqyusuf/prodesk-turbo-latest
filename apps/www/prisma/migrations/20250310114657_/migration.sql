/*
  Warnings:

  - You are about to drop the column `checkoutId` on the `SquarePayments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SquarePayments_checkoutId_key` ON `SquarePayments`;

-- AlterTable
ALTER TABLE `SquarePayments` DROP COLUMN `checkoutId`;
