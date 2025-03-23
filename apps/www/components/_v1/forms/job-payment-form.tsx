"use client";

import { EmployeeProfile, JobPayments } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "../../ui/table";
import Money from "../money";
import { useForm } from "react-hook-form";
import { IJobPayment, IJobs } from "@/types/hrm";
import AutoComplete2 from "../auto-complete-tw";
import { Input } from "../../ui/input";
import { useTransition } from "react";
import { makePayment } from "@/app/(v1)/_actions/hrm-jobs/make-payment";
import { transformData } from "@/lib/utils";
import { Button } from "../../ui/button";
import Btn from "../btn";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    user: {
        id;
        name;
        jobIds: number[];
        subTotal;
        total;
        charge;
        chargePercentage;
        profile: EmployeeProfile;
    };
}
export default function JobPaymentForm({ user }: Props) {
    const form = useForm<IJobPayment>({
        defaultValues: {
            paymentMethod: "CHECK",
        },
    });
    const [loading, startTransition] = useTransition();
    const route = useRouter();
    async function submit() {
        startTransition(async () => {
            await makePayment({
                jobIds: user.jobIds,
                payment: {
                    charges: user.charge,
                    amount: user.total,
                    subTotal: user.subTotal,
                    checkNo: form.getValues("checkNo"),
                    paymentMethod: form.getValues("paymentMethod"),
                    userId: user.id,
                    meta: {},
                },
            });
            toast.success("Payment Applied Successfully!");
            route.push("/contractor/jobs/payments/pay");
        });
    }
    return (
        <div className="flex flex-col items-end ">
            <div className="w-1/2s">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>Total:</TableHead>
                            <TableCell align="right">
                                <Money value={user.subTotal} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                Adujustment Discount ({user.chargePercentage}%):
                            </TableHead>
                            <TableCell align="right">
                                <span>
                                    -<Money value={user.charge} />
                                </span>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Total Payout</TableHead>
                            <TableCell align="right">
                                <span>
                                    <Money value={user.total} />
                                </span>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Payment Method</TableHead>
                            <TableCell align="right">
                                <Input
                                    className="h-8 w-28"
                                    {...form.register("paymentMethod")}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Check No</TableHead>
                            <TableCell align="right">
                                <Input
                                    className="h-8 w-28"
                                    {...form.register("checkNo")}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="">
                <Btn onClick={submit} isLoading={loading}>
                    Make Payment
                </Btn>
            </div>
        </div>
    );
}
