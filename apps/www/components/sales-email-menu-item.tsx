import { __sendInvoiceEmailTrigger } from "@/actions/triggers/send-invoice-email";
import { Menu } from "./(clean-code)/menu";
import { toast } from "sonner";
import { SalesType } from "@/app/(clean-code)/(sales)/types";

export function SalesEmailMenuItem({
  salesId,
  orderNo,
  salesType,
  asChild = false,
}: {
  salesId?;
  salesType: SalesType;
  asChild?: boolean;
  orderNo?: string;
}) {
  const isQuote = salesType === "quote";

  const sendInvoiceEmail = async ({ withPayment = false } = {}) => {
    toast.promise(
      async () =>
        await __sendInvoiceEmailTrigger({
          ids: salesId,
          orderIds: orderNo,
          withPayment,
        }),
      {
        loading: "Sending email...",
        error: (data) => data.message,
      },
    );
  };

  const emailLabel = `${isQuote ? "Quote" : "Invoice"} Email`;

  const emailMenuItem = (
    <>
      <Menu.Item onClick={() => sendInvoiceEmail({ withPayment: false })}>
        {emailLabel}
      </Menu.Item>
      {isQuote || (
        <Menu.Item onClick={() => sendInvoiceEmail({ withPayment: true })}>
          With Payment Link
        </Menu.Item>
      )}
      <Menu.Item disabled>Reminder Email</Menu.Item>
    </>
  );

  if (asChild) {
    return <>{emailMenuItem}</>;
  }

  return (
    <Menu.Item disabled={!salesId} icon="Email" SubMenu={<>{emailMenuItem}</>}>
      Email
    </Menu.Item>
  );
}
