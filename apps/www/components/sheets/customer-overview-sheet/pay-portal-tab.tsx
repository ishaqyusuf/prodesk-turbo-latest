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
import { CheckCircle, Dot } from "lucide-react";
import { CustomSheetContentPortal } from "../custom-sheet-content";
import { SheetFooter } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPaymentSchema } from "@/actions/schema";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/common/controls/form-select";
import { SelectItem } from "@/components/ui/select";
import { salesPaymentMethods } from "@/utils/constants";
import { Menu } from "@/components/(clean-code)/menu";
import FormInput from "@/components/common/controls/form-input";
import { env } from "process";
import { z } from "zod";
import { SubmitButton } from "@/components/submit-button";
import { createSalesPaymentAction } from "@/actions/create-sales-payment";
import { useAction } from "next-safe-action/hooks";
import { getTerminalPaymentStatusAction } from "@/actions/get-terminal-payment-status";
import { cancelTerminaPaymentAction } from "@/actions/cancel-terminal-payment-action";

export function PayPortalTab({}) {
  const query = useCustomerOverviewQuery();

  const loader = async () => await getCustomerPayPortalAction(query.accountNo);
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
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      // terminal: null as CreateTerminalPaymentAction["resp"],
      paymentMethod: undefined,
      accountNo: query?.params?.accountNo,
      salesIds: query?.params?.["pay-selections"],
      amount: undefined,
      // squarePaymentId: undefined,
      // paymentMethod: tx.paymentMethod,
      // amount: tx.totalPay,
      checkNo: undefined,
      deviceId: undefined,
      enableTip: undefined,
      terminalPaymentSession: undefined,
    },
  });

  const [waitSeconds, setWaitSeconds] = useState(null);

  async function terminalPaymentSuccessful() {
    makePayment.execute({
      ...form.getValues(),
      // squarePaymentId,
    });
  }
  useEffect(() => {
    form.setValue("salesIds", query.params?.["pay-selections"]);
  }, [query.params?.["pay-selections"]]);
  const pm = form.watch("paymentMethod");
  const terminalPaymentSession = form.watch("terminalPaymentSession");
  // useEffect(() => {
  //     if (terminalPaymentSession?.status == "PENDING") {
  //         // terminalPaymentSuccessful();
  //     }
  // }, [terminalPaymentSession, waitSeconds]);
  const makePayment = useAction(createSalesPaymentAction, {
    onSuccess: (args) => {
      if (args.data.terminalPaymentSession) {
        setWaitSeconds(0);
        form.setValue(
          "terminalPaymentSession",
          args.data.terminalPaymentSession,
        );
      } else {
      }

      // query.setParams({
      //     "pay-selections": [],
      // });
      // skel.reload();
    },
  });
  const cancelTerminalPayment = useAction(cancelTerminaPaymentAction, {
    onSuccess: (args) => {
      setWaitSeconds(null);
      form.setValue("terminalPaymentSession", null);
    },
  });
  function checkTerminalStatus() {
    setTimeout(
      () => {
        checkTerminalPaymentStatus.execute({
          checkoutId: terminalPaymentSession.squareCheckoutId,
        });
      },
      waitSeconds > 5 ? 2000 : waitSeconds > 10 ? 3000 : 1500,
    );
  }
  const checkTerminalPaymentStatus = useAction(getTerminalPaymentStatusAction, {
    onSuccess: (args) => {
      if (args.data.status == "COMPLETED") {
        setWaitSeconds(null);
      }
      switch (args.data.status) {
        case "COMPLETED":
          //   form.setValue("terminal.tip", response.tip);
          form.setValue("terminalPaymentSession.status", "COMPLETED");
          terminalPaymentSuccessful();
          //   await paymentReceived();
          break;
        case "CANCELED":
        case "CANCEL_REQUESTED":
          form.setValue("terminalPaymentSession.status", "CANCELED");
          cancelTerminalPayment.execute({
            checkoutId: terminalPaymentSession.squareCheckoutId,
          });
          //   await cancelTerminalPayment();

          break;
        default:
          setWaitSeconds((waitSeconds || 0) + 1);
          checkTerminalStatus();
          break;
      }
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
                      <TCell.Date>{sale.createdAt}</TCell.Date>
                    </DataSkeleton>
                  </TableCell>
                  <TableCell className="font-mono">
                    <DataSkeleton pok="orderId">
                      <TCell.Primary>{sale.orderId}</TCell.Primary>
                    </DataSkeleton>
                  </TableCell>
                  <TableCell className="font-mono" align="right">
                    $
                    <DataSkeleton as="span" pok="moneyLarge">
                      {formatMoney(sale?.grandTotal)}
                    </DataSkeleton>
                  </TableCell>
                  <TableCell className="font-mono" align="right">
                    $
                    <DataSkeleton as="span" pok="moneyLarge">
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
              <form
                onSubmit={form.handleSubmit(makePayment.execute)}
                className="grid w-full grid-cols-2 gap-2"
              >
                <FormSelect
                  size="sm"
                  control={form.control}
                  name="paymentMethod"
                  options={salesPaymentMethods}
                  titleKey="label"
                  valueKey="value"
                  label="Payment Method"
                />
                <FormInput
                  control={form.control}
                  name="amount"
                  type="number"
                  size="sm"
                  label={"Amounts"}
                  prefix="$"
                  // disabled
                  // disabled={tx.inProgress}
                />
                <FormInput
                  control={form.control}
                  name="checkNo"
                  size="sm"
                  label={"Check No."}
                  disabled={pm != "check"}
                  // disabled={tx.inProgress}
                />
                <FormSelect
                  options={data?.terminals || []}
                  control={form.control}
                  size="sm"
                  // disabled={tx.inProgress}
                  name="deviceId"
                  disabled={pm != "terminal"}
                  SelectItem={({ option }) => (
                    <SelectItem
                      value={option.value}
                      disabled={
                        env.NEXT_PUBLIC_NODE_ENV == "production"
                          ? option.status != "PAIRED"
                          : false
                      }
                      className=""
                    >
                      <div className="flex items-center gap-2">
                        <Dot
                          className={cn(
                            option.status == "PAIRED"
                              ? "text-green-500"
                              : "text-red-600",
                          )}
                        />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )}
                  label="Terminal"
                />
                <div className="flex col-span-2 justify-end">
                  <SubmitButton
                    isSubmitting={makePayment.isExecuting}
                    disabled={
                      makePayment.isExecuting || !form.formState.isValid
                    }
                  >
                    Pay
                  </SubmitButton>
                </div>
              </form>
            </Form>
          </SheetFooter>
        </CustomSheetContentPortal>
      </DataSkeletonProvider>
    </div>
  );
}
