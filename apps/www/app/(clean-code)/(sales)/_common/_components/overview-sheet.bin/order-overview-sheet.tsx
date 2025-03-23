import TableItemOverviewSheet, {
    TableSheetHeader,
} from "@/components/(clean-code)/data-table/item-overview-sheet";
import { useInfiniteDataTable } from "@/components/(clean-code)/data-table/use-data-table";
import { motion, AnimatePresence } from "framer-motion";
import { SalesItemProp } from "../../../sales-book/(pages)/_components/orders-page-cells";

import { _modal } from "@/components/common/modal/provider";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useSalesOverview,
    OverviewProvider,
    DispatchOverviewProvider,
} from "./overview-provider";
import { SalesGeneralOverview } from "./general/sales-general-overview";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemProdView } from "./production/item-prod-view";

import { ShippingForm } from "./shipping/shipping-form";
import { cn } from "@/lib/utils";
import { SalesShippingTab } from "./shipping/sales-shippings-tab";
import { ShippingOverview } from "./shipping/shipping-overview";
import "./style.css";
import ActionFooter from "./footer/action-footer";
import NotificationTab from "./notification";
import { SalesDispatchListDto } from "../../data-access/dto/sales-shipping-dto";
import { PaymentTab, TerminalPay } from "./payments/payment-tab";
import { SalesItemsOverview } from "./item-view/sales-items-overview";
import { isProdClient } from "@/lib/is-prod";
import { useEffect } from "react";
import { openSalesOverview } from "../sales-overview-sheet";
export function OrderOverviewSheet({}) {
    // if (isProdClient) return;
    const { table, selectedRow } = useInfiniteDataTable();
    const item: SalesItemProp = selectedRow?.original as any;

    if (!item) return;
    return (
        <TableItemOverviewSheet>
            <OverviewProvider item={item}>
                <div className="flex">
                    <SecondaryTab />
                    <PrimaryTab />
                </div>
            </OverviewProvider>
        </TableItemOverviewSheet>
    );
}
export function DispatchOverviewSheet({}) {
    const { table, selectedRow } = useInfiniteDataTable();
    const item: SalesDispatchListDto = selectedRow?.original as any;
    if (!item) return;
    return (
        <TableItemOverviewSheet>
            <DispatchOverviewProvider item={item}>
                <div className="flex">
                    <SecondaryTab />
                    <PrimaryTab />
                </div>
            </DispatchOverviewProvider>
        </TableItemOverviewSheet>
    );
}
function PrimaryTab() {
    const ctx = useSalesOverview();

    return (
        <div
            className={cn(
                "w-[60vw] lg:w-[600px]",
                ctx.tabData && "hidden xl:block"
            )}
        >
            <TableSheetHeader
                title={[
                    ctx.item?.orderId,
                    ctx.item?.displayName || ctx.item?.customerPhone,
                ]
                    ?.filter(Boolean)
                    .join(" | ")}
                rowChanged={ctx.rowChanged}
            />
            <Tabs
                value={ctx.primaryTab}
                onValueChange={ctx.setPrimaryTab as any}
            >
                <TabsList className="w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                    {!ctx.item?.isQuote ? (
                        <>
                            <TabsTrigger value="payments">Payments</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        </>
                    ) : (
                        <></>
                    )}
                    <TabsTrigger value="notifications">
                        Notification
                    </TabsTrigger>
                </TabsList>
                <ScrollArea className="o-scrollable-content-area-tabbed relative">
                    <TabsContent value="general">
                        <SalesGeneralOverview />
                    </TabsContent>
                    <TabsContent className="" value="items">
                        <SalesItemsOverview />
                    </TabsContent>
                    <TabsContent className="" value="payments">
                        <PaymentTab />
                    </TabsContent>
                    <TabsContent className="" value="shipping">
                        <SalesShippingTab />
                    </TabsContent>
                    <TabsContent className="" value="notifications">
                        <NotificationTab />
                    </TabsContent>
                    <ActionFooter />
                </ScrollArea>
            </Tabs>
            <TerminalPay />
        </div>
    );
}
function SecondaryTab({}) {
    const ctx = useSalesOverview();
    if (!ctx.tabData) return null;
    function Render() {
        switch (ctx.tabData.slug) {
            case "itemView":
                return <ItemProdView />;
            case "createShipping":
                return <ShippingForm />;
            case "shippingView":
                return <ShippingOverview />;
        }
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                // className="absolute right-0 w-[500px] border-l bg-gray-100 p-4"
                className="border-r "
            >
                <Render />
            </motion.div>
        </AnimatePresence>
    );
}
