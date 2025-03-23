import { Menu } from "@/components/(clean-code)/menu";
import { openLink } from "@/lib/open-link";
import { SalesPrintProps } from "@/app/(v2)/printer/sales/page";
import { toast } from "sonner";
import { salesPdf } from "@/app/(v2)/printer/_action/sales-pdf";
import { salesOverviewStore } from "../store";
import QueryString from "qs";
import { env } from "@/env.mjs";

interface Props {
    pdf?: boolean;
    data?;
}
export function PrintMenuAction({ pdf, data }: Props) {
    let ctx = salesOverviewStore();
    if (data) ctx = data as any;
    // const dispatchList = ctx.item.dispatchList || [];
    const type = ctx.overview?.type;
    function print(params?: SalesPrintProps["searchParams"]) {
        const query = {
            slugs: ctx.overview?.orderId,
            mode: type,
            preview: false,
            ...(params || {}),
        } as SalesPrintProps["searchParams"];
        if (!pdf) openLink(`/printer/sales`, query, true);
        else {
            toast.promise(
                async () => {
                    // const pdf = await salesPdf(query);
                    const pdf = await fetch(
                        `${
                            env.NEXT_PUBLIC_NODE_ENV == "production"
                                ? ""
                                : "https://gnd-prodesk.vercel.app"
                        }/api/pdf/sales?${QueryString.stringify(query)}`
                    ).then((res) => res.json());
                    const link = document.createElement("a");
                    // link.href = pdf.url;
                    const downloadUrl = pdf.url.replace(
                        "/fl_attachment/",
                        `/fl_attachment:${query.slugs}/`
                    ); //+ `/${query.slugs}.pdf`;

                    link.href = downloadUrl;
                    link.download = `${query.slugs}.pdf`;
                    link.click();
                },
                {
                    loading: "Creating pdf...",
                    success(data) {
                        return "Downloaded.";
                    },
                    error(data) {
                        return "Something went wrong";
                    },
                }
            );
        }
    }
    if (type == "quote")
        return (
            <Menu.Item
                icon={pdf ? "pdf" : "print"}
                onClick={() => {
                    print();
                }}
            >
                {pdf ? "PDF" : "Print"}
            </Menu.Item>
        );
    return (
        <Menu.Item
            icon={pdf ? "pdf" : "print"}
            SubMenu={
                <>
                    {/* <Menu.Item
                        SubMenu={
                            dispatchList?.length == 0 ? null : (
                                <>
                                    <Menu.Item onClick={() => {}}>
                                        {pdf ? "PDF " : "Print "} All
                                    </Menu.Item>
                                    {dispatchList.map((d) => (
                                        <Menu.Item
                                            key={d.id}
                                            onClick={() => {}}
                                        >
                                            {d.title}
                                        </Menu.Item>
                                    ))}
                                </>
                            )
                        }
                        icon="packingList"
                        disabled={dispatchList?.length == 0}
                    >
                        Packing List
                    </Menu.Item> */}
                    <Menu.Item
                        icon="orders"
                        onClick={() => {
                            print({
                                mode: "order-packing",
                                dispatchId: "all",
                            });
                        }}
                    >
                        Order & Packing
                    </Menu.Item>
                    <Menu.Item
                        icon="orders"
                        onClick={() => {
                            print();
                        }}
                    >
                        Order
                    </Menu.Item>
                    <Menu.Item
                        icon="production"
                        onClick={() => {
                            print({
                                mode: "production",
                            });
                        }}
                    >
                        Production
                    </Menu.Item>
                </>
            }
        >
            {pdf ? "PDF" : "Print"}
        </Menu.Item>
    );
}
