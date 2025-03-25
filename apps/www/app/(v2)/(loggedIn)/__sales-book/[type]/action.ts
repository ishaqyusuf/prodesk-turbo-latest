"use server";

import { ISalesType } from "@/types/sales";
import { Prisma } from "@prisma/client";

interface QueryProps {
  _q?: string;
  type: ISalesType;
}
export async function getSalesAction(query: QueryProps) {
  const where: Prisma.SalesOrdersWhereInput = {
    type: query.type,
  };
}
