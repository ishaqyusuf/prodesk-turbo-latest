"use server";

import { paginatedAction } from "@/app/_actions/get-action-utils";
import { prisma } from "@/db";
import { DeliveryOption } from "@/types/sales";
import { Prisma } from "@prisma/client";
import { _getProductionList } from "../productions/_components/actions";

interface QueryProps {}
export async function getDispatchSales(
    deliveryOption: DeliveryOption,
    query: QueryProps
) {
    return await _getProductionList({
        query: {
            deliveryOption,
            // pastDue: true,
        },
        // production: false,
    });
    const where: Prisma.SalesOrdersWhereInput = {
        deliveryOption,
    };
    const { pageCount, skip, take } = await paginatedAction(
        query,
        prisma.salesOrders,
        where
    );
    const data = await prisma.salesOrders.findMany({
        where,
        skip,
        take,
        include: {},
    });
}
export async function getDispatchPreviewAction() {
    return {};
}
