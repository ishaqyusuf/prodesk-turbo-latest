/*
  Warnings:

  - Added the required column `siteActionNotificationId` to the `SiteActionTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SiteActionNotification` ADD COLUMN `custom` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `SiteActionTicket` ADD COLUMN `siteActionNotificationId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SiteActionNotificationActiveForUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `siteActionNotificationId` INTEGER NOT NULL,
    `deletedAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SiteActionNotificationActiveForUsers_id_key`(`id`),
    INDEX `SiteActionNotificationActiveForUsers_siteActionNotificationI_idx`(`siteActionNotificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `SiteActionTicket_siteActionNotificationId_idx` ON `SiteActionTicket`(`siteActionNotificationId`);
