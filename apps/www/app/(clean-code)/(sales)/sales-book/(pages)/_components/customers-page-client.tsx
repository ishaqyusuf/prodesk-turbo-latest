"use client";
import {
    DataTable,
    InfiniteDataTablePageProps,
} from "@/components/(clean-code)/data-table";
import { useTableCompose } from "@/components/(clean-code)/data-table/use-table-compose";
import { GetCustomersDta } from "../../../_common/data-access/customer.dta";
import { TCell } from "@/components/(clean-code)/data-table/table-cells";
import { __filters } from "../../../_common/utils/contants";
import { DataTableFilterCommand } from "@/components/(clean-code)/data-table/filter-command";
import { DataTableInfinityToolbar } from "@/components/(clean-code)/data-table/infinity/data-table-toolbar";
import QueryTab from "@/app/(clean-code)/_common/query-tab";
import { QueryTabAction } from "@/app/(clean-code)/_common/query-tab/query-tab-edit";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/_v1/icons";
import { Badge } from "@/components/ui/badge";

export default function CustomersPageClient(props: InfiniteDataTablePageProps) {
    const table = useTableCompose({
        cells(ctx) {
            return [
                ctx.Column("Name", "name", NameCell),
                ctx.Column("Phone", "phone", PhoneCell),
                ctx.Column("Sales", "sales", SalesCell),
                ...__filters().customers.filterColumns,
            ];
        },
        filterFields: props.filterFields,
        cellVariants: {
            size: "sm",
        },
    });

    return (
        <div className="bg-white">
            <DataTable.Infinity
                checkable
                queryKey={props.queryKey}
                {...table.props}
            >
                {/* <DataTable.BatchAction></DataTable.BatchAction> */}
                <DataTable.Header className="bg-white">
                    <div className="flex justify-between items-end mb-2 gap-2 sm:sticky">
                        <div className="">
                            <QueryTab page="customers" />
                        </div>
                        <div className="flex-1"></div>
                        <QueryTabAction />
                        <Button size="sm">
                            <Icons.add className="size-4 mr-2" />
                            <span>New</span>
                        </Button>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex-1">
                            <DataTableFilterCommand />
                        </div>
                        <DataTableInfinityToolbar />
                    </div>
                </DataTable.Header>
                <DataTable.Table />
                <DataTable.LoadMore />
            </DataTable.Infinity>
        </div>
    );
}
interface ItemProps {
    item: GetCustomersDta["data"][number];
}
function NameCell({ item }: ItemProps) {
    return (
        <TCell>
            <TCell.Primary>{item.name || item.businessName}</TCell.Primary>
        </TCell>
    );
}
function PhoneCell({ item }: ItemProps) {
    return (
        <TCell>
            <TCell.Secondary>{item.phoneNo}</TCell.Secondary>
        </TCell>
    );
}
function SalesCell({ item }: ItemProps) {
    return (
        <TCell>
            <TCell.Secondary>
                <Badge variant="outline" className="font-mono">
                    {item._count.salesOrders}
                </Badge>
            </TCell.Secondary>
        </TCell>
    );
}
