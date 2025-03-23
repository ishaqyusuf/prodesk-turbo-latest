"use client";

import { TableShellProps } from "@/types/data-table";
// import { ISalesOrder } from "@/types/ISales";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useTransition } from "react";
import {
    ColumnHeader,
    DateCellContent,
    _FilterColumn,
} from "../../../../../../components/_v1/columns/base-columns";

import {
    OrderIdCell,
    OrderInvoiceCell,
    OrderMemoCell,
    OrderPriorityFlagCell,
    OrderProductionStatusCell,
    OrderStatus,
    SalesCustomerCell,
} from "./cells/sales-columns";
import { ISalesOrder } from "@/types/sales";
import { OrderRowAction } from "../../../../../../components/_v1/actions/sales-menu-actions";
import { DataTable2 } from "../../../../../../components/_v1/data-table/data-table-2";

import { SalesBatchAction } from "../../../../../../components/_v1/list-selection-action/sales-selection-action";
import { SalesCustomerFilter } from "./sales-customer-filter";
import { SmartTable } from "../../../../../../components/_v1/data-table/smart-table";
import { useMediaQuery } from "react-responsive";
import { screens } from "@/lib/responsive";
import SalesOrderMobileCell from "../../../../../../components/_v1/mobile/sales/sales-order-mobile-cell";
import { DynamicFilter } from "@/components/_v1/data-table/data-table-dynamic-filter";
import { _getSalesRep } from "../_actions/get-sales-rep.action";
import { getSalesOrder } from "@/app/(v1)/(loggedIn)/sales/_actions/sales";
import DeliveryCell from "./cells/delivery-cell";
import { useCmd } from "@/components/cmd/provider";
import { TableCol } from "@/components/common/data-table/table-cells";
import { ServerPromiseType } from "@/types";
import useDataTableColumn from "@/components/common/data-table/columns/use-data-table-columns";
import { SalesCells } from "./cells";
import { GetSales } from "@/data-access/sales";

// type DataServerPromiseType = ServerPromiseType<typeof getSalesOrder>;
export type SalesTableItem = GetSales["data"][number];

export default function OrdersTableShell({ promise, searchParams }) {
    const [isPending, startTransition] = useTransition();
    const { data, pageCount, pageInfo }: GetSales = React.use(promise);
    const isMobile = useMediaQuery(screens.xs);
    const _table = useDataTableColumn(
        data,
        (ctx) =>
            isMobile
                ? []
                : [
                      ctx.Column("Flag", SalesCells.Flag, { noTitle: true }),
                      ctx.Column("Order", SalesCells.Order),
                  ],
        true,
        {
            filterCells: ["_q", "_withDeleted"],
        }
    );

    const cmd = useCmd([
        {
            title: "special action",
            action: () => console.log("special action"),
        },
    ]);
    const table = SmartTable<ISalesOrder>(data);

    // const paymentMode
    const columns = useMemo<ColumnDef<ISalesOrder, unknown>[]>(
        () =>
            isMobile
                ? [
                      {
                          id: "order",
                          cell: ({ row }) => (
                              <SalesOrderMobileCell order={row.original} />
                          ),
                      },
                      ..._FilterColumn(
                          "_status",
                          "_q",
                          "_payment",
                          "_customerId",
                          "_date"
                      ),
                  ]
                : [
                      table.checkColumn(),
                      {
                          id: "flag",
                          maxSize: 10,
                          cell: ({ row }) =>
                              OrderPriorityFlagCell(row.original, true),
                      },
                      {
                          accessorKey: "orderId",
                          cell: ({ row }) =>
                              OrderIdCell(
                                  row.original,
                                  row.original.isDyke
                                      ? `/sales-v2/overview/${row.original.type}/slug`
                                      : "/sales/order/slug"
                              ),
                          header: ColumnHeader("Order"),
                      },
                      {
                          accessorKey: "customer",
                          header: ColumnHeader("Customer"),
                          cell: ({ row }) => (
                              <SalesCustomerCell order={row.original} />
                          ),
                          //   OrderCustomerCell(
                          //       row.original.customer,
                          //       "/sales/customer/slug",
                          //       row.original.shippingAddress?.phoneNo
                          //   ),
                      },
                      {
                          accessorKey: "memo",
                          header: ColumnHeader("Address"),
                          cell: ({ row }) =>
                              OrderMemoCell(row.original.shippingAddress),
                      },
                      table.simpleColumn("Rep", (data) => ({
                          story: [table.secondary(data.salesRep?.name)],
                      })),
                      {
                          accessorKey: "invoice",
                          header: ColumnHeader("Total/Dues"),
                          cell: ({ row }) => (
                              <OrderInvoiceCell order={row.original} />
                          ),
                      },
                      {
                          accessorKey: "paymentDueDate",
                          header: ColumnHeader("Invoice Due"),
                          cell: ({ row }) => (
                              <>
                                  <TableCol.Date>
                                      {row.original.paymentDueDate}
                                  </TableCol.Date>
                              </>
                          ),
                      },
                      ...(searchParams?._dateType == "paymentDueDate"
                          ? [
                                {
                                    accessorKey: "production",
                                    header: ColumnHeader("Production"),
                                    cell: ({ row }) =>
                                        OrderProductionStatusCell(row.original),
                                },
                            ]
                          : []),
                      {
                          accessorKey: "delivery",
                          header: ColumnHeader("Delivery"),
                          cell: ({ row }) => (
                              <DeliveryCell item={row.original as any} />
                          ),
                      },
                      {
                          accessorKey: "status",
                          header: ColumnHeader("Status"),
                          cell: ({ row }) => (
                              <OrderStatus order={row.original} />
                          ),
                      },
                      ..._FilterColumn(
                          "_status",
                          "_q",
                          "_payment",
                          "_customerId",
                          "_salesRepId",
                          "_dateType",
                          "_date"
                      ),
                      {
                          // accessorKey: "actions",
                          id: "actions",
                          header: ColumnHeader(""),
                          position: "sticky",
                          size: 15,
                          maxSize: 15,
                          enableSorting: false,
                          cell: ({ row }) => (
                              <OrderRowAction row={row.original} />
                          ),
                      },
                  ],
        [data, isPending]
    );
    return (
        <>
            <DataTable2
                searchParams={searchParams}
                columns={_table.columns}
                // pageInfo={pageInfo}
                pageCount={pageCount}
                mobile
                data={data as any}
                BatchAction={SalesBatchAction}
                filterableColumns={[
                    {
                        id: "status",
                        title: "Status",
                        single: true,
                        options: [
                            { label: "Production Started", value: "Started" },
                            { label: "Production Assigned", value: "Queued" },
                            {
                                label: "Production Completed",
                                value: "Completed",
                            },
                            {
                                label: "Production Not Assigned",
                                value: "Unassigned",
                            },
                        ],
                    },
                    {
                        id: "_payment" as any,
                        title: "Invoice",
                        single: true,
                        options: [
                            { label: "Paid", value: "Paid" },
                            // { label: "Part Paid", value: "Part" },
                            { label: "Pending", value: "Pending" },
                        ],
                    },
                    SalesCustomerFilter,
                    ({ table }) => (
                        <DynamicFilter
                            table={table}
                            single
                            listKey="staticList"
                            labelKey="name"
                            valueKey="id"
                            title="Sales Rep"
                            columnId="_salesRepId"
                            loader={_getSalesRep}
                        />
                    ),
                ]}
                searchableColumns={[
                    {
                        id: "_q" as any,
                        title: "orderId, customer",
                    },
                ]}
                dateFilterColumns={[
                    {
                        filter: {
                            title: "Filter By",
                            id: "_dateType" as any,
                            defaultValue: "createdAt",
                            single: true,
                            options: [
                                {
                                    label: "Date Created",
                                    value: "createdAt",
                                },
                                {
                                    label: "Due Payments",
                                    value: "paymentDueDate",
                                },
                            ],
                        },
                        id: "_date" as any,
                        title: "Date",
                    },
                ]}
            />
        </>
    );
}
