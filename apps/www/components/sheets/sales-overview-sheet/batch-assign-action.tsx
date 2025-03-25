import { Menu } from "@/components/(clean-code)/menu";
import { useSalesOverviewItemsTab } from "./items-tab-context";
import { TabFloatingAction } from "./tab-floating-action";
import { Icons } from "@/components/_v1/icons";
import { AnimateReveal } from "@/components/animate-reveal";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import useEffectLoader from "@/lib/use-effect-loader";
import { getSalesProdWorkersAsSelectOption } from "@/app/(clean-code)/(sales)/_common/use-case/sales-prod-workers-use-case";
import { useForm, useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/use-day";
import { assignAllPendingToProductionAction } from "@/app/(clean-code)/(sales)/_common/data-actions/production-actions/batch-action";
import { salesOverviewStore } from "@/app/(clean-code)/(sales)/_common/_components/sales-overview-sheet/store";
import CustomBtn from "@/components/common/button";
import { toast } from "sonner";
import { refreshTabData } from "@/app/(clean-code)/(sales)/_common/_components/sales-overview-sheet/helper";
import { Button } from "@/components/ui/button";

export function BatchAssignActionMenu() {
  const ctx = useSalesOverviewItemsTab();
  const store = salesOverviewStore();
  return (
    <>
      <Menu.Item
        SubMenu={
          <>
            <Menu.Item
              onClick={() => {
                // ctx.form.setValue(
                //     "batchAction",
                //     "assign-production"
                // );
                // ctx.form.setValue("selectMode", true);

                const selections = store.itemOverview.items
                  .filter(
                    (a) =>
                      a.produceable &&
                      a.status.qty?.total > a.status.prodAssigned?.total,
                  )
                  .map((a) => ({
                    itemUid: a.itemControlUid,
                  }));
                // ctx.form.setValue("selections", selections);
                ctx.form.reset({
                  selections,
                  batchAction: "assign-production",
                  selectMode: true,
                });
                setTimeout(() => {
                  ctx.selectionArray.append(selections);
                }, 2000);
              }}
            >
              All
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                ctx.form.setValue("batchAction", "assign-production");
                ctx.form.setValue("selectMode", true);
              }}
            >
              Selection
            </Menu.Item>
          </>
        }
      >
        Assign Production
      </Menu.Item>
    </>
  );
}

export function BatchAssignAction() {
  const ctx = useSalesOverviewItemsTab();
  const opened = ctx.selectMode && ctx.batchAction == "assign-production";
  useEffect(() => {
    if (opened) {
      console.log("LOAD");
    }
  }, [opened]);
  const form = useForm({
    defaultValues: {
      dueDate: null,
      assignedToId: null,
    },
  });
  if (!opened) return null;
  return (
    <TabFloatingAction>
      <Form {...form}>
        <AnimateReveal opened={opened}>
          {/* <div className="border flex items-center space-x-2"> */}
          <Label className="font-mono whitespace-nowrap px-2">
            <span className="font-bold">{ctx.selectCount}</span>
            {/* {" of "} */}
            {/* <span className="font-bold">{total}</span> */}
            {" selected"}
          </Label>
          <AssignTo />
          <DueDate />
          <AssignBtn />
          <Button
            size="xs"
            variant="ghost"
            className="rounded-none hover:bg-red-500 hover:text-white"
            onClick={(e) => {
              // ctx.form.setValue("selectMode", false);
              ctx.form.reset({
                batchAction: null,
                selectMode: false,
              });
              // ctx.form.setValue("batchAction", "");
            }}
          >
            <Icons.X className="size-4" />
          </Button>
          {/* </div> */}
        </AnimateReveal>
      </Form>
    </TabFloatingAction>
  );
}
function AssignBtn() {
  const form = useFormContext();
  const ctx = useSalesOverviewItemsTab();
  const store = salesOverviewStore();

  async function onSubmit() {
    const { dueDate, assignedToId } = form.getValues();
    toast.promise(
      new Promise(async (resolve, reject) => {
        const controlIds = ctx.selections?.map((a) => a.itemUid);
      }),
      {
        loading: "Assigning...",
      },
    );
    await assignAllPendingToProductionAction(
      {
        salesId: store.overview.id,
        dueDate,
        assignedToId,
        controlIds: ctx.selections?.map((a) => a.itemUid),
      },
      true,
    );
    toast.success("Assigned to production");
    refreshTabData("items");
    ctx.form.reset({
      batchAction: null,
      selectMode: false,
    });
  }
  return (
    <CustomBtn
      action={onSubmit}
      size="xs"
      className="rounded-none hover:bg-green-500 hover:text-white"
      variant="ghost"
    >
      Save
    </CustomBtn>
  );
}
function DueDate() {
  const form = useFormContext();
  const _date = form.watch("dueDate");
  const [open, onOpenChange] = useState(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <Button
          size="xs"
          className="whitespace-nowrap p-0 rounded-none text-start"
          variant="ghost"
        >
          <Label className="font-mono px-2  w-24 line-clamp-1">
            <span className="font-bold">
              {_date ? formatDate(_date) : "Due Date"}
            </span>
            {/* {" of "} */}
            {/* <span className="font-bold">{total}</span> */}
          </Label>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={_date}
          onSelect={(e) => {
            form.setValue("dueDate", e);
            onOpenChange(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
function AssignTo() {
  const workers = useEffectLoader(getSalesProdWorkersAsSelectOption);
  const form = useFormContext();
  const assignedToId = form.watch("assignedToId");
  const assignedTo = workers.data?.find(
    (worker) => worker.value == assignedToId,
  );

  return (
    <Menu
      Trigger={
        <Button
          size="xs"
          className="whitespace-nowrap p-0 rounded-none text-start"
          variant="ghost"
        >
          <Label className="font-mono px-2  w-24 line-clamp-1">
            {assignedTo ? (
              <span className="">{assignedTo?.label}</span>
            ) : (
              <span className="font-bold">Assign To</span>
            )}
            {/* {" of "} */}
            {/* <span className="font-bold">{total}</span> */}
          </Label>
        </Button>
      }
    >
      {workers?.data?.map((worker) => (
        <Menu.Item
          key={worker.value}
          onClick={() => {
            form.setValue("assignedToId", worker.value);
          }}
        >
          {worker.label}
        </Menu.Item>
      ))}
    </Menu>
  );
}
