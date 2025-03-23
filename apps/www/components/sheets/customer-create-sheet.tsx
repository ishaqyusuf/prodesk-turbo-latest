"use client";

import { useCreateCustomerParams } from "@/hooks/use-create-customer-params";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { CustomSheet, CustomSheetContent } from "./custom-sheet-content";
import { CustomerForm } from "../forms/customer-form";
import useEffectLoader from "@/lib/use-effect-loader";
import { getCustomerFormAction } from "@/actions/get-customer-form";

export function CustomerCreateSheet() {
    const { params, setParams } = useCreateCustomerParams();

    const opened = params?.customerForm;
    const customerData = useEffectLoader(
        async () => {
            if (!opened || !params.customerId) return null;
            return await getCustomerFormAction(params.customerId);
        },
        {
            deps: [opened, params.customerId],
        }
    );
    const cData = customerData?.data;
    if (!opened) return;
    return (
        <CustomSheet
            onOpenChange={(e) => {
                setTimeout(() => {
                    setParams(null);
                }, 500);
            }}
            size="lg"
            rounded
            floating
            open={opened}
        >
            <SheetHeader>
                <SheetTitle>
                    {!params.customerId ? "Update " : "Create "}Customer
                </SheetTitle>
            </SheetHeader>
            <CustomSheetContent>
                <CustomerForm data={cData} />
            </CustomSheetContent>
        </CustomSheet>
    );
}
