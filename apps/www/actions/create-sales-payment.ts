import { z } from "zod";
import { actionClient } from "./safe-action";
import { createPaymentSchema } from "./schema";
import { errorHandler } from "@/modules/error/handler";
import { createSquareTerminalCheckout } from "@/modules/square";
import { prisma } from "@/db";
import { SquarePaymentMethods } from "@/app/(clean-code)/(sales)/types";
import { authId } from "@/app/(v1)/_actions/utils";
import { SquarePaymentStatus } from "@/_v2/lib/square";

export const createSalesPaymentAction = actionClient
    .schema(createPaymentSchema)
    .metadata({
        name: "create-sales-payment",
    })
    .action(async ({ parsedInput: { ...input } }) => {
        let response = {
            terminalPaymentSession: null as typeof input.terminalPaymentSession,
        };
        if (input.paymentMethod == "terminal") {
            const { error, resp: data } = await createTerminalPayment(input);
            if (error) throw Error(error.message);
            response.terminalPaymentSession = {
                squarePaymentId: data.squarePaymentId,
                squareCheckoutId: data.squareCheckout.id,
                status: data.status,
                // tip: data.tip
            };
        } else {
            //
        }
        return response;
    });

async function createTerminalPayment(
    props: z.infer<typeof createPaymentSchema>,
) {
    return await errorHandler(async () => {
        const checkout = await createSquareTerminalCheckout({
            deviceId: props.deviceId,
            allowTipping: props.enableTip,
            amount: props.amount,
        });

        const squarePayment = await prisma.squarePayments.create({
            data: {
                paymentId: checkout.id,
                squareOrderId: checkout.squareOrderId,
                amount: props.amount,
                paymentMethod: "terminal" as SquarePaymentMethods,
                createdBy: {
                    connect: {
                        id: await authId(),
                    },
                },
                status: "PENDING" as SquarePaymentStatus,
                paymentTerminal: {
                    connectOrCreate: {
                        where: {
                            terminalId: props.deviceId,
                        },
                        create: {
                            terminalId: props.deviceId,
                            terminalName: props.deviceName,
                        },
                    },
                },
            },
        });
        return {
            squarePaymentId: squarePayment.id,
            squareCheckout: checkout,
            status: squarePayment.status as SquarePaymentStatus,
            tip: null,
        };
    });
}
