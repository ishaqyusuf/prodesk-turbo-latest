/*
  Warnings:

  - A unique constraint covering the columns `[userId,siteActionNotificationId,deletedAt]` on the table `SiteActionNotificationActiveForUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `SiteActionNotificationActiveForUsers_userId_siteActionNotifi_key` ON `SiteActionNotificationActiveForUsers`;

-- CreateIndex
CREATE UNIQUE INDEX `SiteActionNotificationActiveForUsers_userId_siteActionNotifi_key` ON `SiteActionNotificationActiveForUsers`(`userId`, `siteActionNotificationId`, `deletedAt`);
