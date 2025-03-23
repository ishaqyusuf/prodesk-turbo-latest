-- AlterTable
ALTER TABLE `SalesPayments` ADD COLUMN `squarePaymentsId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `SalesPayments_squarePaymentsId_idx` ON `SalesPayments`(`squarePaymentsId`);
