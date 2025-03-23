"use client";
import { Button } from "@/components/ui/button";
import {
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCustomerOverviewQuery } from "@/hooks/use-customer-overview-query";
import { useEffect } from "react";
import { CustomSheet, CustomSheetContent } from "../custom-sheet-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./general-tab";
import { PayPortalTab } from "./pay-portal-tab";

export function CustomerOverviewSheet() {
    const ctx = useCustomerOverviewQuery();

    useEffect(() => {
        async function getCustomerData() {}
        if (ctx.opened) {
        }
    }, [ctx.accountNo, ctx.opened]);
    const currenTab = ctx.params?.tab;
    return (
        <CustomSheet
            open={ctx.opened}
            rounded
            size="xl"
            onOpenChange={ctx.close}
        >
            <Tabs
                value={currenTab}
                onValueChange={(e) => {
                    ctx.setParams({
                        tab: e as any,
                    });
                }}
                className=""
            >
                <SheetHeader>
                    <SheetTitle>Customer Overview</SheetTitle>
                    <SheetDescription>
                        <TabsList className="w-full flex justify-start">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="sales">Sales</TabsTrigger>
                            <TabsTrigger value="quotes">Quotes</TabsTrigger>
                            <TabsTrigger value="transactions">
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value="pay-portal">
                                Pay Portal
                            </TabsTrigger>
                        </TabsList>
                    </SheetDescription>
                </SheetHeader>
            </Tabs>
            <CustomSheetContent className="-mt-4">
                <Tabs value={currenTab}>
                    <TabsContent value="general">
                        <GeneralTab />
                    </TabsContent>
                    <TabsContent value="pay-portal">
                        <PayPortalTab />
                    </TabsContent>
                </Tabs>
            </CustomSheetContent>
        </CustomSheet>
    );
}
