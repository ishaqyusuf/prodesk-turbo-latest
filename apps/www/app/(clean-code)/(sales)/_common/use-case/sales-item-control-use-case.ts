"use server";

import { prisma } from "@/db";
import { Prisma } from "@prisma/client";

export async function updateSalesItemControlUseCase(
  data: Prisma.SalesItemControlCreateManyInput,
) {
  await prisma.salesItemControl.upsert({
    where: {
      uid: data.uid,
    },
    create: {
      uid: data.uid,
      produceable: data.produceable,
      // salesId: data.salesId,
      sales: {
        connect: {
          id: data.salesId,
        },
      },
      shippable: data.shippable,
    },
    update: {
      produceable: data.produceable,
      shippable: data.shippable,
    },
  });
}
