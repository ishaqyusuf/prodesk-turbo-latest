"use client";

import { TableShellProps } from "@/types/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import {
    ColumnHeader,
    Cell,
    PrimaryCellContent,
    SecondaryCellContent,
} from "../columns/base-columns";
import { DataTable2 } from "../data-table/data-table-2";

import { BuilderFilter } from "../filters/builder-filter";
import {
    DeleteRowAction,
    RowActionCell,
} from "../data-table/data-table-row-actions";

import { EmployeeProfile } from "@prisma/client";
import { deleteEmployeeProfile } from "@/app/(v1)/_actions/hrm/employee-profiles";

export default function EmployeeProfileTableShell<T>({
    data,
    pageInfo,
    searchParams,
}: TableShellProps<EmployeeProfile>) {
    const [isPending, startTransition] = useTransition();

    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const columns = useMemo<ColumnDef<EmployeeProfile, unknown>[]>(
        () => [
            {
                maxSize: 10,
                id: "id",
                header: ColumnHeader("#"),
                cell: ({ row }) => (
                    <Cell>
                        <PrimaryCellContent>
                            {row.original.id}
                        </PrimaryCellContent>
                    </Cell>
                ),
            },
            {
                id: "title",
                header: ColumnHeader("Profile Name"),
                cell: ({ row }) => (
                    <Cell>
                        {/* link={`/community/project/slug`} slug={row.original.slug} */}
                        <PrimaryCellContent>
                            {row.original.name}
                        </PrimaryCellContent>
                    </Cell>
                ),
            },
            {
                id: "discount",
                header: ColumnHeader("Discount"),
                cell: ({ row }) => (
                    <Cell>
                        <SecondaryCellContent>
                            {row.original.discount || 0}%{" "}
                        </SecondaryCellContent>
                    </Cell>
                ),
            },

            {
                accessorKey: "actions",
                header: ColumnHeader(""),
                size: 15,
                maxSize: 15,
                enableSorting: false,
                cell: ({ row }) => (
                    <RowActionCell>
                        <DeleteRowAction
                            row={row.original}
                            action={deleteEmployeeProfile}
                        />
                    </RowActionCell>
                ),
            },
        ], //.filter(Boolean) as any,
        [data, isPending]
    );
    return (
        <DataTable2
            searchParams={searchParams}
            columns={columns}
            pageInfo={pageInfo}
            data={data}
            filterableColumns={[BuilderFilter]}
            searchableColumns={[
                {
                    id: "_q" as any,
                    title: "",
                },
            ]}

            //  deleteRowsAction={() => void deleteSelectedRows()}
        />
    );
}
