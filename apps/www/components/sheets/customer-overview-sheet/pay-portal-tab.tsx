import { getCustomerPayPortalAction } from "@/actions/get-customer-pay-portal-action";
import { TCell } from "@/components/(clean-code)/data-table/table-cells";
import { DataSkeleton } from "@/components/data-skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCustomerOverviewQuery } from "@/hooks/use-customer-overview-query";
import {
    DataSkeletonProvider,
    useCreateDataSkeletonCtx,
} from "@/hooks/use-data-skeleton";
import { formatMoney } from "@/lib/use-number";
import { cn, sum } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { CustomSheetContentPortal } from "../custom-sheet-content";
import { SheetFooter } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPaymentSchema } from "@/actions/schema";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/common/controls/form-select";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { salesPaymentMethods } from "@/utils/constants";
import { Menu } from "@/components/(clean-code)/menu";

export function PayPortalTab({}) {
    const query = useCustomerOverviewQuery();

    const loader = async () =>
        await getCustomerPayPortalAction(query.accountNo);
    const skel = useCreateDataSkeletonCtx({
        loader,
        autoLoad: true,
    });
    const data = skel?.data;
    const selections = query.params?.["pay-selections"];
    useEffect(() => {
        const amountDue = sum(
            data?.pendingSales?.filter((a) => selections?.includes(a.id)),
            "amountDue",
        );
        form.setValue("amount", amountDue);
    }, [selections, data]);
    const form = useForm({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: {
            // terminal: null as CreateTerminalPaymentAction["resp"],
            paymentMethod: undefined,
            amount: undefined,
            // paymentMethod: tx.paymentMethod,
            // amount: tx.totalPay,
            checkNo: undefined,
            deviceId: undefined,
            enableTip: undefined,
        },
    });
    return (
        <div className="">
            <DataSkeletonProvider value={skel}>
                <Table className="table-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Order #</TableHead>
                            <TableHead className="text-end">Total</TableHead>
                            <TableHead className="text-end">Pending</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skel
                            .renderList(data?.pendingSales, 5, {
                                createdAt: new Date(),
                                amountDue: 500,
                                grandTotal: 1000,
                                id: 2,
                                orderId: "",
                            })
                            ?.map((sale, i) => (
                                <TableRow
                                    key={i}
                                    className={cn(
                                        "cursor-pointer",
                                        selections?.includes(sale?.id)
                                            ? "bg-muted-foreground/30 hover:bg-muted-foreground/30"
                                            : "hover:bg-muted-foreground/25",
                                    )}
                                    onClick={(e) => {
                                        let sels = [...(selections || [])];
                                        const index = sels.indexOf(sale.id);
                                        if (index >= 0) sels.splice(index, 1);
                                        else sels.push(sale.id);

                                        query.setParams({
                                            "pay-selections": sels,
                                        });
                                    }}
                                >
                                    <TableCell className="w-10">
                                        <CheckCircle
                                            className={cn(
                                                "size-4",
                                                selections?.includes(sale?.id)
                                                    ? "text-green-700"
                                                    : "opacity-20",
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <DataSkeleton pok="date">
                                            <TCell.Date>
                                                {sale.createdAt}
                                            </TCell.Date>
                                        </DataSkeleton>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        <DataSkeleton pok="orderId">
                                            <TCell.Primary>
                                                {sale.orderId}
                                            </TCell.Primary>
                                        </DataSkeleton>
                                    </TableCell>
                                    <TableCell
                                        className="font-mono"
                                        align="right"
                                    >
                                        $
                                        <DataSkeleton
                                            as="span"
                                            pok="moneyLarge"
                                        >
                                            {formatMoney(sale?.grandTotal)}
                                        </DataSkeleton>
                                    </TableCell>
                                    <TableCell
                                        className="font-mono"
                                        align="right"
                                    >
                                        $
                                        <DataSkeleton
                                            as="span"
                                            pok="moneyLarge"
                                        >
                                            {formatMoney(sale?.amountDue)}
                                        </DataSkeleton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <CustomSheetContentPortal>
                    <SheetFooter>
                        <Form {...form}>
                            <div className="grid w-full grid-cols-2 gap-4">
                                <Menu>
                                    <Menu.Item>Item 1</Menu.Item>
                                    <Menu.Item>Item 2</Menu.Item>
                                    <Menu.Item>Item 3</Menu.Item>
                                </Menu>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">
                                                Apple
                                            </SelectItem>
                                            <SelectItem value="banana">
                                                Banana
                                            </SelectItem>
                                            <SelectItem value="blueberry">
                                                Blueberry
                                            </SelectItem>
                                            <SelectItem value="grapes">
                                                Grapes
                                            </SelectItem>
                                            <SelectItem value="pineapple">
                                                Pineapple
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <DataSkeleton>
                                    <FormSelect
                                        size="sm"
                                        control={form.control}
                                        name="paymentMethod"
                                        options={salesPaymentMethods}
                                        titleKey="label"
                                        valueKey="value"
                                        label="Payment Method"
                                    />
                                </DataSkeleton>
                            </div>
                        </Form>
                    </SheetFooter>
                </CustomSheetContentPortal>
            </DataSkeletonProvider>
        </div>
    );
}
