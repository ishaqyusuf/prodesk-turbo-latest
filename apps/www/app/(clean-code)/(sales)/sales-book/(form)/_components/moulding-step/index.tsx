import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Context, useCreateContext, useCtx } from "./ctx";
import { MouldingClass } from "../../_utils/helpers/zus/moulding-class";

import { MoneyBadge } from "@/components/(clean-code)/money-badge";
import { DataLine } from "@/components/(clean-code)/data-table/Dl";
import { Menu } from "@/components/(clean-code)/menu";
import Money from "@/components/_v1/money";
import { Label } from "@/components/ui/label";
import ConfirmBtn from "@/components/_v1/confirm-btn";
import { cn } from "@/lib/utils";
import { LineInput } from "../line-input";
import { AnimatedNumber } from "@/components/animated-number";

interface Props {
    itemStepUid;
}
export default function MouldingLineItem({ itemStepUid }: Props) {
    const ctx = useCreateContext(itemStepUid);
    return (
        <>
            <Context.Provider value={ctx}>
                <Table className="p-4 text-xs table-fixed font-medium">
                    <TableHeader>
                        <TableRow className="uppercase">
                            <TableHead className="w-10">Sn.</TableHead>
                            <TableHead className="w-full">Moulding</TableHead>
                            <TableHead className="w-28">Qty</TableHead>
                            <TableHead className="w-28">Estimate</TableHead>
                            <TableHead className="w-28">Addon/Qty</TableHead>
                            <TableHead className="w-28">Line Total</TableHead>
                            <TableHead className="w-16"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ctx.mouldings?.map((m, index) => (
                            <MouldingRow sn={index + 1} data={m} key={m.uid} />
                        ))}
                    </TableBody>
                </Table>
            </Context.Provider>
        </>
    );
}
function MouldingRow({
    data,
    sn,
}: {
    sn;
    data: ReturnType<
        MouldingClass["getMouldingLineItemForm"]
    >["mouldings"][number];
}) {
    const ctx = useCtx();
    const mfd = ctx.itemForm?.groupItem?.form?.[data.uid];

    const lineUid = data.uid;

    const valueChanged = () => {
        ctx.ctx.updateGroupedCost();
        ctx.ctx.calculateTotalPrice();
    };
    return (
        <TableRow className={cn(!mfd?.selected && "hidden")}>
            <TableCell className="font-mono">{sn}.</TableCell>
            <TableCell className="font-mono font-medium text-sm">
                {data.title}
            </TableCell>
            <TableCell>
                <LineInput
                    cls={ctx.ctx}
                    name="qty.total"
                    lineUid={lineUid}
                    type="number"
                    valueChanged={valueChanged}
                />
            </TableCell>
            <TableCell className="">
                <Menu
                    noSize
                    Icon={null}
                    label={<Money value={mfd?.pricing?.unitPrice} />}
                >
                    <div className="p-2 min-w-[300px]">
                        <div>
                            <Label>Price Summary</Label>
                        </div>
                        <dl>
                            {ctx.pricedSteps?.map((step) => (
                                <DataLine
                                    size="sm"
                                    key={step.title}
                                    label={step.title}
                                    value={
                                        <div className="flex gap-4 items-center justify-end">
                                            <span>{step.value}</span>
                                            <MoneyBadge>
                                                {step.price}
                                            </MoneyBadge>
                                        </div>
                                    }
                                />
                            ))}
                            <DataLine
                                size="sm"
                                label="Moulding"
                                value={
                                    <div className="flex gap-4 items-center justify-end">
                                        <span className="line-clamp-2 max-w-xs">{`${data.title}`}</span>
                                        <MoneyBadge>
                                            {data.basePrice?.price}
                                        </MoneyBadge>
                                    </div>
                                }
                            />
                            <DataLine
                                size="sm"
                                label="Custom Price"
                                value={
                                    <LineInput
                                        className="w-28"
                                        cls={ctx.ctx}
                                        name="pricing.customPrice"
                                        lineUid={lineUid}
                                        type="number"
                                        valueChanged={valueChanged}
                                    />
                                }
                            />
                        </dl>
                    </div>
                </Menu>
            </TableCell>
            <TableCell>
                <LineInput
                    cls={ctx.ctx}
                    name="pricing.addon"
                    lineUid={lineUid}
                    type="number"
                    valueChanged={valueChanged}
                />
                {/* <FormInput
                        type="number"
                        size="sm"
                        control={form.control}
                        name="pricing.addon"
                        inputProps={inputProps}
                    /> */}
            </TableCell>
            <TableCell>
                <AnimatedNumber value={mfd?.pricing?.totalPrice || 0} />
                {/* <Money value={mfd?.pricing?.totalPrice} /> */}
            </TableCell>
            <TableCell align="right">
                <ConfirmBtn
                    disabled={ctx.ctx.selectCount == 1}
                    onClick={() => {
                        ctx.ctx.removeGroupItem(data.uid);
                    }}
                    trash
                    size="icon"
                />
            </TableCell>
        </TableRow>
    );
}
