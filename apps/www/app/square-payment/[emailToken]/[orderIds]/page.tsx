"use client";

import { createSalesCheckoutLinkAction } from "@/actions/create-sales-payment-checkout";
import {
    getSalesPaymentCheckoutInfoAction,
    GetSalesPaymentCheckoutInfo,
} from "@/actions/get-sales-payment-checkout-info-action";
import { Icons } from "@/components/_v1/icons";
import Money from "@/components/_v1/money";
import Button from "@/components/common/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { openLink } from "@/lib/open-link";
import { timeout } from "@/lib/timeout";
import { cn } from "@/lib/utils";
import { formatPaymentParams } from "@/utils/format-payment-params";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// export async function generateMetadata({ params }) {
//     return constructMetadata({
//         title: `Create Quote - gndprodesk.com`,
//     });
// }
export default function Page({ params }) {
    const { emailToken, orderIdsParam, orderIds } = formatPaymentParams(params);
    const [data, setData] = useState<GetSalesPaymentCheckoutInfo>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const resp = await getSalesPaymentCheckoutInfoAction(
                orderIds,
                emailToken
            );
            setData(resp);
            setLoading(false);
        }
        load();
    }, [emailToken, orderIdsParam]);
    async function createPayment() {
        try {
            // await timeout(1000);
            const resp = await createSalesCheckoutLinkAction({
                emailToken,
                orderIdsParam,
                orderIds,
            });
            console.log({ resp });
            openLink((resp as any).paymentLink);
        } catch (error) {
            console.log(error);
            toast.error("Unable to complete");
        }
        // const paymentLink = await
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="flex items-center  space-x-2 mb-6">
                <Icons.LogoLg />
                <h1 className="text-2xl font-semibold text-gray-800">
                    Sales Checkout
                </h1>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <Icons.spinner className="h-12 w-12 animate-spin text-blue-500" />
                        <p className="text-gray-600">
                            Loading payment details...
                        </p>
                    </div>
                ) : data?.orders?.length ? (
                    <div className="space-y-4">
                        {data.orders?.length == 1 ? (
                            <>
                                <div className="text-lg">
                                    <p className="font-medium text-gray-600">
                                        Customer Name:
                                    </p>
                                    <p className="text-gray-800 font-semibold">
                                        {data?.orders?.[0]?.customerName}
                                    </p>
                                </div>
                                <div className="text-lg">
                                    <p className="font-medium text-gray-600">
                                        Invoice No:
                                    </p>
                                    <p className="text-gray-800 font-semibold">
                                        {data?.orders?.[0]?.orderNo}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Billing</TableHead>
                                            <TableHead>Due</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    {order.orderNo}
                                                </TableCell>
                                                <TableCell>
                                                    {order.customerName}
                                                </TableCell>
                                                <TableCell>
                                                    <Money
                                                        value={order.amountDue}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}
                        {data.amountDue <= 0 ? (
                            <p className="text-green-600 font-medium text-center">
                                No payment is due at this time.
                            </p>
                        ) : (
                            <>
                                <div
                                    className={cn(
                                        "text-lg",
                                        data.orders.length > 1 &&
                                            "flex flex-col items-end"
                                    )}
                                >
                                    <p className="font-medium text-gray-600">
                                        Due Amount:
                                    </p>
                                    <p className="text-gray-800 font-bold">
                                        <Money value={data.amountDue} />
                                    </p>
                                </div>

                                <Button
                                    action={createPayment}
                                    size="lg"
                                    className="w-full"
                                    // className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
                                >
                                    Pay Now
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-red-500 text-center">
                        Failed to load payment details.
                    </p>
                )}
            </div>
        </div>
    );
}
