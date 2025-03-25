import { _modal } from "@/components/common/modal/provider";
import FormSettingsModal from "./modals/form-settings-modal";
import { useFormDataStore } from "../_common/_stores/form-data-store";
import { Sticky } from "../_hooks/use-sticky";
import { cn } from "@/lib/utils";
import Button from "@/components/common/button";
import { Menu } from "@/components/(clean-code)/menu";

import { openSalesOverview } from "../../../_common/_components/sales-overview-sheet";
import { MenuIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

import { DatePicker } from "@/components/_v1/date-range-picker";

import { SalesFormSave } from "@/components/forms/sales-form/sales-form-save";
import { SalesFormEmailMenu } from "@/components/forms/sales-form/sales-form-email-menu";
import { SalesFormPrintMenu } from "@/components/forms/sales-form/sales-form-print-menu";

export function FormHeader({ sticky }: { sticky: Sticky }) {
  const zus = useFormDataStore();
  const { isFixed, containerRef } = sticky;
  const tabs = [
    { name: "info", title: "Sales Info", default: true },
    { name: "invoice", title: "Invoice Builder" },
    { name: "address", title: "Customer Info" },
    // { name: "info", title: "Customer Info" },
  ];

  function isActive(tab) {
    return (!zus.currentTab && tab.default) || zus.currentTab == tab.name;
  }

  return (
    <div
      style={
        isFixed
          ? {
              left: `${containerRef?.current?.getBoundingClientRect()?.left}px`,
              width: `${
                containerRef?.current?.getBoundingClientRect()?.width
              }px`,
              //   right: `${
              //       containerRef?.current?.getBoundingClientRect()
              //           ?.right
              //   }px`,
            }
          : {}
      }
      className={cn(
        "flex border-b items-center mb-4",
        isFixed &&
          "fixed border-2s border sborder-muted-foreground/50 shadow-xl  overflow-hidden rounded-fulls  top-[55px] bg-background z-10",
      )}
    >
      <div className="">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            size="default"
            onClick={(e) => {
              zus.dotUpdate("currentTab", tab.name as any);
            }}
            className={cn(
              "border-b-2  border-transparent rounded-none text-muted-foreground",
              isActive(tab) ? "border-primary text-primary bg-muted" : "",
              tab.name == "address" && "lg:hidden",
            )}
            variant="ghost"
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div className="flex-1" />
      <div className="flex gap-4 px-4 py-2 items-center">
        <CreatedDate />
        <Button
          size="xs"
          icon="settings"
          onClick={() => {
            _modal.openSheet(<FormSettingsModal />);
          }}
          variant="outline"
        >
          <span className="">Settings</span>
        </Button>

        <Button
          size="xs"
          disabled={!zus.metaData.id}
          onClick={() => {
            openSalesOverview({
              salesId: zus.metaData.id,
            });
          }}
        >
          <span className="">Overview</span>
        </Button>
        <div className="flex">
          <Menu Icon={MenuIcon}>
            <SalesFormSave type="menu" and="close" />
            <SalesFormSave type="menu" and="new" />
            {/* <Menu.Item onClick={() => save("close")}>
                            Save & Close
                        </Menu.Item>
                        <Menu.Item onClick={() => save("new")}>
                            Save & New
                        </Menu.Item> */}
            <Menu.Item>Copy</Menu.Item>
            <Menu.Item disabled>Move To Sales</Menu.Item>
            <Menu.Item disabled>Move To Quotes</Menu.Item>
          </Menu>
          <SalesFormSave type="button" />
        </div>

        <Menu>
          <SalesFormPrintMenu />
          <SalesFormEmailMenu />
        </Menu>
      </div>
    </div>
  );
}
function CreatedDate() {
  const zus = useFormDataStore();

  return (
    <div className="inline-flex items-center space-x-2">
      <Label>Date:</Label>
      <DatePicker
        // disabled={(date) => date > new Date()}
        setValue={(e) => {
          // form.setValue("order.createdAt", e)
          zus.dotUpdate("metaData.createdAt", e);
        }}
        className="w-auto h-8"
        value={zus.metaData?.createdAt}
      />
    </div>
  );
}
