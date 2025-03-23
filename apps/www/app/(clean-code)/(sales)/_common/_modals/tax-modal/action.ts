"use server";

import { Taxes } from "@prisma/client";
import { createSalesTax } from "../../data-access/sales-tax.persistent";

export async function createTax(data: Taxes) {
    data.percentage = Number(data.percentage);

    const s = await createSalesTax(data);
    return s;
}
