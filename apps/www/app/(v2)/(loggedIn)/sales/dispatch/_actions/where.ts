import { Prisma } from "@prisma/client";

export function whereDispatchSalesOrders(query) {
    const where: Prisma.OrderDeliveryWhereInput = {
        deliveryMode: query.type,
    };
    return where;
}
