/*
  Warnings:

  - A unique constraint covering the columns `[taxCode,customerId,deletedAt]` on the table `CustomerTaxProfiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `CustomerTaxProfiles_taxCode_customerId_key` ON `CustomerTaxProfiles`;

-- AlterTable
ALTER TABLE `CustomerTaxProfiles` ADD COLUMN `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `deletedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CustomerTaxProfiles_taxCode_customerId_deletedAt_key` ON `CustomerTaxProfiles`(`taxCode`, `customerId`, `deletedAt`);
