"use server";

import { prisma } from "@/db";
import { getSalesTransactionsAction } from "./get-sales-transactions";

export async function getOrderTransactionHistoryAction(id) {
  const transactions = await getSalesTransactionsAction({
    "sales.id": id,
  });
  return transactions;
}
