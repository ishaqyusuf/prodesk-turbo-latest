"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderCircle, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { useEffect } from "react";
import { Kbd } from "../../kbd";
import { useInfiniteDataTable } from "../use-data-table";

interface DataTableToolbarProps<TData> {
    // table: Table<TData>;
    // controlsOpen: boolean;
    // setControlsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // isLoading?: boolean;
    // enableColumnOrdering?: boolean;
}

export function DataTableInfinityToolbar<TData>({}: // table,
// controlsOpen,
// setControlsOpen,
// isLoading,
// enableColumnOrdering,
DataTableToolbarProps<TData>) {
    const {
        table,
        isLoading,
        setControlsOpen,
        controlsOpen,
        enableColumnOrdering,
    } = useInfiniteDataTable();
    const filters = table.getState().columnFilters;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setControlsOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setControlsOpen]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="sflex flex-wrap items-center gap-2 hidden">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setControlsOpen((prev) => !prev)}
                                className="flex gap-2"
                            >
                                {controlsOpen ? (
                                    <>
                                        <PanelLeftClose className="h-4 w-4" />
                                        <span className="hidden sm:block">
                                            Hide Controls
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <PanelLeftOpen className="h-4 w-4" />
                                        <span className="hidden sm:block">
                                            Show Controls
                                        </span>
                                    </>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>
                                Toggle controls with{" "}
                                <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
                                    <span className="mr-0.5">⌘</span>
                                    <span>B</span>
                                </Kbd>
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} of{" "}
                    {table.getCoreRowModel().rows.length} row(s) filtered
                    {/* TODO: add "(total X rows)" */}
                </p>
                {isLoading ? (
                    <LoaderCircle className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
                ) : null}
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
                {filters.length ? (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                ) : null}
                <DataTableViewOptions
                    table={table}
                    enableOrdering={enableColumnOrdering}
                />
            </div>
        </div>
    );
}
