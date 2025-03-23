"use server";

import { unstable_cache } from "next/cache";
import { getSalesTransactionsAction } from "./get-sales-transactions";
import { __gtCustomerSalesTx } from "./revalidate/get-tags";

export async function getRecentCustomerSalesTx(accountNo) {
    const tags = __gtCustomerSalesTx(accountNo);
    // return unstable_cache(
    //     async (accountNo) => {
    const data = await getSalesTransactionsAction({
        "account.no": accountNo,
        size: 5,
        start: 0,
    });
    return data.data;

    //     tags,
    //     {
    //         tags: tags,
    //     }
    // )(accountNo);
}
