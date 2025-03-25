"use server";
import { prisma } from "@/db";
import { resend } from "@/lib/resend";
import { nanoid } from "nanoid";
import { render } from "@react-email/render";
import { composeSalesEmail } from "@/modules/email/emails/invoice";
import { env } from "@/env.mjs";
import QueryString from "qs";
import { createNoteAction } from "@/modules/notes/actions/create-note-action";
import { sum } from "@/lib/utils";
import { whereSales } from "@/utils/db/where.sales";
import { getBaseUrl } from "@/envs";
import { composePaymentOrderIdsParam } from "@/utils/format-payment-params";

interface Props {
  ids;
  orderIds;
  withPayment;
}
export const __sendInvoiceEmailTrigger = async ({
  ids: _ids,
  orderIds,
  withPayment,
}: Props) => {
  const where = whereSales({
    "order.no": orderIds,
    id: _ids,
  });
  const __sales = await prisma.salesOrders.findMany({
    where,
    select: {
      slug: true,
      id: true,
      type: true,
      amountDue: true,
      salesRep: {
        select: {
          name: true,
          email: true,
        },
      },
      customer: {
        select: {
          email: true,
          name: true,
          businessName: true,
        },
      },
      billingAddress: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  const noEmail = __sales
    .filter((sales) => sales.customer?.email || sales.billingAddress?.email)
    ?.filter((a) => !a);
  if (noEmail.length) {
    if (__sales.length > 1)
      throw new Error("Some selected sales has no valid customer email");
    else throw new Error("Customer has no valid email");
  }
  await Promise.all(
    __sales.map(async (sales) => {
      // let phoneNo = sales?.customer?.email
      let customerEmail: any =
        sales.customer?.email || sales.billingAddress?.email;
      let matchingSales = __sales.filter((a) => {
        const sEmail = a.customer?.email || a?.billingAddress?.email;
        return customerEmail == sEmail;
      });
      const isDev = env.NODE_ENV == "development";
      let emailSlug = customerEmail?.split("@")[0];
      if (matchingSales?.[0]?.id == sales.id) {
        if (!customerEmail) throw new Error("Customer has no valid email");

        isDev &&
          (customerEmail = ["ishaqyusuf024@gmail.com", "pcruz321@gmail.com"]);
        const salesRepEmail = sales.salesRep.email || undefined;
        const customerName =
          sales.customer?.businessName ||
          sales.customer?.name ||
          sales.billingAddress?.name;
        const salesRep = sales.salesRep?.name;
        const isQuote = sales.type == "quote";
        const pendingAmountSales = matchingSales.filter((s) => s.amountDue > 0);
        const totalDueAmount = sum(pendingAmountSales, "amountDue");
        let paymentLink =
          // !isDev
          //     ? null
          //     :
          totalDueAmount > 0
            ? `${getBaseUrl()}/square-payment/${emailSlug}/${composePaymentOrderIdsParam(
                pendingAmountSales.map((a) => a.slug),
              )}`
            : null;

        const response = await resend.emails.send({
          from: `GND Millwork <${salesRepEmail?.split("@")[0]}@gndprodesk.com>`,
          to: customerEmail,
          reply_to: salesRepEmail,
          headers: {
            "X-Entity-Ref-ID": nanoid(),
          },
          subject: `${salesRep} sent you ${isQuote ? "a quote" : "an invoice"}`,
          html: await render(
            composeSalesEmail({
              type: sales.type as any,
              customerName,
              paymentLink: withPayment ? paymentLink : null,
              link: `${getBaseUrl()}/api/pdf/download?${QueryString.stringify({
                id: sales.id,
                slugs: matchingSales.map((s) => s.slug).join(","),
                mode: sales.type,
                preview: false,
              })}`,
              salesRep,
            }),
          ),
        });
        await Promise.all(
          matchingSales?.map(async (s) => {
            await createNoteAction({
              note: isQuote ? "Quote email sent" : "Invoice email sent",
              subject: "Email Notification",
              headline: "",
              status: "",
              type: "email",
              tags: [
                {
                  tagName: "salesId",
                  tagValue: String(s.id),
                },
              ],
            });
          }),
        );
        if (response.error) throw new Error(`Unable to send email`);
      }
    }),
  );
};
