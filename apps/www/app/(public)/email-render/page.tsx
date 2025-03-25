import { SalesInvoiceEmail } from "@/modules/email/emails/invoice";
import { render } from "@react-email/components";

export default async function EmailRender({}) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen dotted-bg p-4 sm:p-6 md:p-0 ">
      <div className="">
        <p>LOREM</p>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: render(
            <SalesInvoiceEmail
              salesRep="Ishaq"
              customerName={"Yusuf"}
              type={"order"}
            />,
          ),
        }}
      />
    </div>
  );
}
