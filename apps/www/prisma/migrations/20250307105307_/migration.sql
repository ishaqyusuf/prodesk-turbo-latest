/*
  Warnings:

  - You are about to drop the column `dykeStepProductsId` on the `ProductSortIndex` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stepComponentId,uid]` on the table `ProductSortIndex` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stepComponentId` to the `ProductSortIndex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `ProductSortIndex` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProductSortIndex_dykeStepProductsId_idx` ON `ProductSortIndex`;

-- AlterTable
ALTER TABLE `ProductSortIndex` DROP COLUMN `dykeStepProductsId`,
    ADD COLUMN `stepComponentId` INTEGER NOT NULL,
    ADD COLUMN `uid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `ProductSortIndex_stepComponentId_idx` ON `ProductSortIndex`(`stepComponentId`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductSortIndex_stepComponentId_uid_key` ON `ProductSortIndex`(`stepComponentId`, `uid`);
