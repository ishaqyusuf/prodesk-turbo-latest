import { Table, TableBody, TableRow } from "@/components/ui/table";
import { TableCell } from "@/app/_components/data-table/table-cells";
import { Icons } from "@/components/_v1/icons";
import { TCell } from "@/components/(clean-code)/data-table/table-cells";
import { Progress } from "@/components/(clean-code)/progress";
import { Menu } from "@/components/(clean-code)/menu";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/controls/form-input";
import FormCheckbox from "@/components/common/controls/form-checkbox";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import FormSelect from "@/components/common/controls/form-select";
import { SelectItem } from "@/components/ui/select";
import { env } from "@/env.mjs";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/common/button";
import { Label } from "@/components/ui/label";
import { paymentMethods } from "../../../utils/contants";
import { useSalesOverview } from "../overview-provider";

export function PaymentTab({}) {
    const { payCtx: ctx } = useSalesOverview();

    if (!ctx.data) return <>Loading...</>;
    function PaymentBtn() {
        return (
            <Menu
                disabled={!ctx.data.amountDue}
                variant="default"
                label={"Payment"}
                Icon={Icons.add}
            >
                <Menu.Item onClick={() => ctx.createPayment("terminal")}>
                    Terminal
                </Menu.Item>
                <Menu.Item onClick={() => ctx.createPayment("link")}>
                    Payment Link
                </Menu.Item>
            </Menu>
        );
    }
    return (
        <div>
            <div className="">
                <div>
                    {/* {ctx.overview?.shipping?.dispatchableItemList} */}
                </div>
            </div>
            {ctx.data.payments?.length == 0 ? (
                <div className="min-h-[70vh] gap-4 flex flex-col items-center justify-center">
                    <p className="text-muted-foreground">No payment applied</p>
                    <PaymentBtn />
                </div>
            ) : (
                <div className="flex p-2 sm:px-4 gap-4 border-b">
                    <div className="flex-1"></div>
                    <PaymentBtn />
                </div>
            )}
            <div>{/* {paymentCtx.} */}</div>
            <Table>
                <TableBody>
                    {ctx.data.payments.map((p) => (
                        <TableRow className="cursor-pointer" key={p.id}>
                            <TableCell>{p.date}</TableCell>
                            <TableCell>
                                <TCell.Money value={p.amount} />
                            </TableCell>
                            <TableCell>
                                <Progress.Status>{p.status}</Progress.Status>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
export function TerminalPay() {
    const { payCtx: ctx } = useSalesOverview();

    if (!ctx.paymentMethod) return;

    return (
        <div>
            <Form {...ctx.form}>
                <div className="flex sm:justify-end right-0 m-4 sm:m-8 sm:mb-16  absolute bottom-0 mb-16">
                    <Card
                        className={cn(
                            "shadow-xl w-96",
                            ctx.waitingForPayment && "hidden"
                        )}
                    >
                        <CardHeader className="bg-muted p-4">
                            Payment
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <FormSelect
                                size="sm"
                                control={ctx.form.control}
                                name="paymentMethod"
                                options={paymentMethods}
                                titleKey="label"
                                valueKey="value"
                                label="Payment Method"
                            />
                            <FormInput
                                control={ctx.form.control}
                                name="amount"
                                type="number"
                                size="sm"
                                label={"Amount"}
                                prefix="$"
                                disabled={ctx.inProgress}
                            />
                            {ctx.paymentMethod == "check" && (
                                <FormInput
                                    control={ctx.form.control}
                                    name="checkNo"
                                    size="sm"
                                    label={"Check No."}
                                    disabled={ctx.inProgress}
                                />
                            )}
                            {ctx.isTerminal() && (
                                <>
                                    <FormSelect
                                        options={ctx.terminals || []}
                                        control={ctx.form.control}
                                        size="sm"
                                        disabled={ctx.inProgress}
                                        name="deviceId"
                                        SelectItem={({ option }) => (
                                            <SelectItem
                                                value={option.value}
                                                disabled={
                                                    env.NEXT_PUBLIC_NODE_ENV ==
                                                    "production"
                                                        ? option.status !=
                                                          "PAIRED"
                                                        : false
                                                }
                                                className=""
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Dot
                                                        className={cn(
                                                            option.status ==
                                                                "PAIRED"
                                                                ? "text-green-500"
                                                                : "text-red-600"
                                                        )}
                                                    />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        )}
                                        label="Terminal"
                                    />
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex gap-4">
                            {ctx.isTerminal() && (
                                <FormCheckbox
                                    disabled={ctx.inProgress}
                                    switchInput
                                    control={ctx.form.control}
                                    name="enableTip"
                                    label={"Enable Tip"}
                                />
                            )}
                            <div className="flex-1"></div>
                            <Button
                                size="sm"
                                variant="destructive"
                                disabled={ctx.inProgress}
                                onClick={() => {
                                    ctx.closePaymentForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={
                                    ctx.inProgress ||
                                    ctx.paymentMethod == "link"
                                }
                                action={ctx._pay}
                                size="sm"
                            >
                                Proceed
                            </Button>
                        </CardFooter>
                    </Card>
                    <div
                        className={cn(
                            "hidden",
                            ctx.waitingForPayment &&
                                "block border shadow-sm rounded p-2"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Icons.spinner className="h-4 w-4 animate-spin" />
                                <Label>Waiting for payment...</Label>
                            </div>
                            <div className="flex-1"></div>
                            <Button
                                variant="destructive"
                                className="h-6 p-2 text-xs"
                                onClick={ctx.cancelTerminalPayment}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
