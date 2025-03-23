-- CreateTable
CREATE TABLE `CustomerTaxProfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `taxCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerTaxProfiles_id_key`(`id`),
    INDEX `CustomerTaxProfiles_customerId_idx`(`customerId`),
    UNIQUE INDEX `CustomerTaxProfiles_taxCode_customerId_key`(`taxCode`, `customerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
