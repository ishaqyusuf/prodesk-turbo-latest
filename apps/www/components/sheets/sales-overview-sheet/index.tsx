"use client";

import { salesOverviewStore } from "@/app/(clean-code)/(sales)/_common/_components/sales-overview-sheet/store";
import Button from "@/components/common/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCustomerOverviewQuery } from "@/hooks/use-customer-overview-query";
import { useSalesOverviewQuery } from "@/hooks/use-sales-overview-query";
import { CustomSheet, CustomSheetContent } from "../custom-sheet-content";

export default function SalesOverviewSheet() {
  const query = useSalesOverviewQuery();
  const customerQuery = useCustomerOverviewQuery();

  const store = salesOverviewStore();
  if (!query["sales-overview-id"]) return null;

  return (
    <CustomSheet open onOpenChange={query.close} floating rounded size="xl">
      <SheetHeader>
        {/* <SalesOverviewModal /> */}
        <SheetTitle>{store?.overview?.title || "Loading..."}</SheetTitle>
      </SheetHeader>
      <CustomSheetContent className="">
        <div className="min-h-screen">
          <Button
            onClick={() => {
              const queryParams = {
                ...query.params,
              } as any;
              query.setParams(null);
              customerQuery.open("abc", queryParams);
            }}
          >
            Customer
          </Button>
        </div>
      </CustomSheetContent>
    </CustomSheet>
  );
}
