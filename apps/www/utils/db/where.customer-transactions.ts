import { CustomerTransactionType } from "@/actions/get-sales-transactions";
import { composeQuery } from "@/app/(clean-code)/(sales)/_common/utils/db-utils";
import { PaymentMethods } from "@/app/(clean-code)/(sales)/types";
import { SearchParamsType } from "@/components/(clean-code)/data-table/search-params";
import { Prisma } from "@prisma/client";

export function whereCustomerTx(query: SearchParamsType) {
  const whereAnd: Prisma.CustomerTransactionWhereInput[] = [
    {
      OR: [
        {
          AND: [
            { type: {} },
            // { type: "transaction" as CustomerTransactionType },
            {
              amount: {
                lt: 0,
              },
            },
          ],
        },
        {
          paymentMethod: "link" as PaymentMethods,
          amount: {
            gt: 0,
          },
        },
      ],
    },
    // {
    // },
    // {
    //     salesPayments: {
    //         some: {
    //             order: {},
    //         },
    //     },
    // },
  ];
  if (query["account.no"]) {
    whereAnd.push({
      wallet: {
        accountNo: query["account.no"],
      },
    });
  }
  if (query["sales.id"])
    whereAnd.push({
      salesPayments: {
        some: {
          orderId: query["sales.id"],
        },
      },
    });
  return composeQuery(whereAnd);
}
