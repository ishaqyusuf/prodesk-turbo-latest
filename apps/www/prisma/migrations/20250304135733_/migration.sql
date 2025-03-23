/*
  Warnings:

  - You are about to drop the column `customerId` on the `SalesPayments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SalesPayments_customerId_idx` ON `SalesPayments`;

-- AlterTable
ALTER TABLE `SalesPayments` DROP COLUMN `customerId`,
    ADD COLUMN `authorId` INTEGER NULL,
    ADD COLUMN `note` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `SalesPayments_authorId_idx` ON `SalesPayments`(`authorId`);
