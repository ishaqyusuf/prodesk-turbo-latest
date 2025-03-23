"use client";

import { RowActionCell } from "../data-table/data-table-row-actions";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useState, useTransition } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Icons } from "../icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Btn from "../btn";
import { IInboundOrderItems } from "@/types/sales-inbound";

interface Props {
    data: IInboundOrderItems;
}
export default function PutawayActions({ data }: Props) {
    const [location, setLocation] = useState<string>(data.location as any);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const route = useRouter();
    async function updateLocation() {
        startTransition(async () => {
            // const form
            //   await _updateInboundItemLocation(data.id, {
            //     location,
            //   });
            toast.success("Success!");
            route.refresh();
        });
    }
    return (
        <RowActionCell>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button className="h-8  w-8 bg-green-500 p-0">
                        <Icons.edit className="h-4 w-4" />
                        {/* <CheckCircle className="h-4 w-4" /> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="" align="end">
                    <div className="grid gap-2">
                        <Label>Storage Location</Label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="h-8 uppercase"
                        />
                    </div>
                    <div className="mt-2 flex justify-end">
                        <Btn
                            onClick={updateLocation}
                            isLoading={isPending}
                            className="h-8"
                        >
                            Putaway
                        </Btn>
                    </div>
                </PopoverContent>
            </Popover>
        </RowActionCell>
    );
}
