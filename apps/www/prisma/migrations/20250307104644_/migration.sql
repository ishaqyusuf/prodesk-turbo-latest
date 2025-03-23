-- CreateIndex
CREATE INDEX `DealerAuth_primaryBillingAddressId_idx` ON `DealerAuth`(`primaryBillingAddressId`);

-- CreateIndex
CREATE INDEX `DealerAuth_primaryShippingAddressId_idx` ON `DealerAuth`(`primaryShippingAddressId`);

-- CreateIndex
CREATE INDEX `DealerStatusHistory_dealerId_idx` ON `DealerStatusHistory`(`dealerId`);

-- CreateIndex
CREATE INDEX `DealerStatusHistory_authorId_idx` ON `DealerStatusHistory`(`authorId`);

-- CreateIndex
CREATE INDEX `DealerToken_dealerId_idx` ON `DealerToken`(`dealerId`);

-- CreateIndex
CREATE INDEX `ProductSortIndex_dykeStepProductsId_idx` ON `ProductSortIndex`(`dykeStepProductsId`);

-- CreateIndex
CREATE INDEX `SalesCheckout_userId_idx` ON `SalesCheckout`(`userId`);

-- CreateIndex
CREATE INDEX `Session_userId_idx` ON `Session`(`userId`);
