"use server";

import { Prisma } from "@prisma/client";
import {
  getComponentPricingListByUidDta,
  saveComponentPricingsDta,
  updateComponentPricingsDta,
} from "../data-access/sales-pricing-dta";
import { composeSalesPricing } from "../utils/sales-pricing-utils";

export async function saveComponentPricingUseCase(
  data: Prisma.DykePricingSystemCreateManyInput[],
) {
  await saveComponentPricingsDta(data);
}
export async function updateComponentPricingUseCase(
  data: Partial<Prisma.DykePricingSystemCreateManyInput>[],
) {
  return await updateComponentPricingsDta(data);
}
export async function getPricingByUidUseCase(componentUid) {
  return composeSalesPricing(
    await getComponentPricingListByUidDta(componentUid),
  );
}
