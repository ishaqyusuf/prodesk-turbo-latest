/*
  Warnings:

  - A unique constraint covering the columns `[tenderId]` on the table `CheckoutTenders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CheckoutTenders_tenderId_key` ON `CheckoutTenders`(`tenderId`);
