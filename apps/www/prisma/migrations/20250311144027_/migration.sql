-- AlterTable
ALTER TABLE `OrderItemProductionAssignments` ADD COLUMN `shelfItemId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `OrderItemProductionAssignments_shelfItemId_idx` ON `OrderItemProductionAssignments`(`shelfItemId`);
