"use server";

import { SquarePaymentStatus } from "@/_v2/lib/square";
import { SalesPaymentStatus } from "@/app/(clean-code)/(sales)/types";
import { prisma } from "@/db";
import { formatMoney } from "@/lib/use-number";
import { sum } from "@/lib/utils";
import { NotifySalesRepPayment } from "./triggers/sales-rep-payment-notification";

interface Props {
  salesPaymentId: string;
}
export async function finalizeSalesCheckout({ salesPaymentId }: Props) {
  const cTx = await prisma.customerTransaction.findFirst({
    where: {
      squarePayment: {
        paymentId: salesPaymentId,
      },
    },
    include: {
      salesPayments: {
        include: {
          order: true,
        },
      },
      squarePayment: {
        include: {
          orders: {
            include: {
              order: {
                select: {
                  id: true,
                  amountDue: true,
                  orderId: true,
                  customer: {
                    select: {
                      businessName: true,
                      name: true,
                    },
                  },
                  billingAddress: {
                    select: {
                      name: true,
                    },
                  },
                  salesRep: {
                    select: {
                      email: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          checkout: {
            include: {
              tenders: true,
            },
          },
        },
      },
    },
  });
  const status: SquarePaymentStatus = cTx.status as any;
  if (status == "COMPLETED") throw new Error("Payment Already Applied!");

  const tenders = cTx.squarePayment.checkout.tenders;
  const validTenders = tenders.filter(
    (s) => s.status == ("COMPLETED" as SquarePaymentStatus),
  );
  if (!validTenders.length) {
    // const _status = Array.from(new Set(cTx.squarePayment.checkout.tenders.map(s =>s.status)));
    await prisma.customerTransaction.update({
      where: {
        id: cTx.id,
      },
      data: {
        status: "FAILED" as SquarePaymentStatus,
      },
    });
    throw new Error("Unable to validate payment");
  }
  const [totalAmount, totalTip] = [
    sum(validTenders, "amount"),
    sum(validTenders, "tip"),
  ];
  const squarePayment = cTx.squarePayment;
  const tip =
    totalTip > 0 ? formatMoney(totalTip / squarePayment.orders.length) : 0;
  let balance = totalAmount;
  let salesRepsNotifications: {
    [email in string]: NotifySalesRepPayment;
  } = {};
  const proms = await Promise.all(
    squarePayment.orders.map(async (o) => {
      let orderAmountDue = formatMoney(o.order.amountDue);
      let paidAmount =
        balance >= orderAmountDue
          ? orderAmountDue
          : formatMoney(orderAmountDue - balance);
      balance = formatMoney(balance - paidAmount);
      if (paidAmount) {
        const sp = await prisma.salesPayments.create({
          data: {
            amount: paidAmount,
            tip,
            orderId: o.orderId,
            // squarePayments: {
            //     connect: {
            //         id: squarePayment.id,
            //     },
            // },
            note: `payment via square checkout`,
            status: `success` as SalesPaymentStatus,
            transactionId: cTx.id,
            squarePaymentsId: squarePayment.id,

            // transaction: {
            //     connect: {
            //         id: cTx.id,
            //     },
            // },
          },
        });
        const ord = await prisma.salesOrders.update({
          where: {
            id: o.orderId,
          },
          data: {
            amountDue: formatMoney(orderAmountDue - paidAmount),
          },
          select: {
            amountDue: true,
            orderId: true,
          },
        });
        const salesRep = o.order.salesRep;
        if (salesRep) {
          if (!salesRepsNotifications[salesRep.email])
            salesRepsNotifications[salesRep.email] = {
              amount: 0,
              email: salesRep.email,
              repName: salesRep.name,
              customerName:
                o.order.customer?.businessName ||
                o.order.customer?.name ||
                o.order.billingAddress?.name,
              ordersNo: [],
            };
          salesRepsNotifications[salesRep.email].amount += paidAmount;
          salesRepsNotifications[salesRep.email].ordersNo.push(o.order.orderId);
        }
        return {
          sp,
          ord,
        };
      }
      return {
        paidAmount,
      };
    }),
  );
  await prisma.customerTransaction.update({
    where: {
      id: cTx.id,
    },
    data: {
      status: "COMPLETED" as SquarePaymentStatus,
      amount: totalAmount,
    },
  });
  return {
    proms,
    notifications: Object.values(salesRepsNotifications),
    tip,
    totalAmount,
  };
}
