"use server";

import { prisma } from "@/db";

export async function getCustomerWalletAction(accountNo) {
    const wallet = await prisma.customerWallet.upsert({
        where: {
            accountNo,
        },
        update: {},
        create: {
            balance: 0,
            accountNo,
        },
    });
    return wallet;
}
