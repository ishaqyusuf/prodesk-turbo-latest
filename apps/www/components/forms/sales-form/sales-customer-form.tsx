import { useFormDataStore } from "@/app/(clean-code)/(sales)/sales-book/(form)/_common/_stores/form-data-store";

import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Button from "@/components/common/button";
import { Icons } from "@/components/_v1/icons";
import { useCreateCustomerParams } from "@/hooks/use-create-customer-params";
import {
  CustomersListData,
  getCustomersAction,
} from "@/actions/cache/get-customers";
import {
  CustomerFormData,
  customerFormStaticCallbacks,
} from "../customer-form";
import { getCustomerFormAction } from "@/actions/get-customer-form";
import { SettingsClass } from "@/app/(clean-code)/(sales)/sales-book/(form)/_utils/helpers/zus/settings-class";
import { findCustomerIdFromBilling } from "@/actions/find-customer-id-from-billing";
export function SalesCustomerForm() {
  const zus = useFormDataStore();
  const md = zus.metaData;
  const setting = useMemo(() => new SettingsClass(), []);
  useEffect(() => {
    setTimeout(() => {
      if (md.customer?.id) onCustomerSelect(md?.customer?.id, false);
      else {
        if (md.bad) {
          findCustomerIdFromBilling(md.bad).then((customerId) => {
            console.log(customerId);
            // return;
            if (customerId) onCustomerSelect(customerId, false);
          });
        }
      }
    }, 250);
  }, []);
  const [customer, setCustomer] = useState<CustomerFormData>(null);
  const onCustomerSelect = (customerId, resetSalesData = true) => {
    getCustomerFormAction(customerId).then((resp) => {
      setCustomer(resp);
      zus.dotUpdate("metaData.customer.id", customerId);
      zus.dotUpdate("metaData.billing.id", resp?.addressId);
      if (resetSalesData) {
        zus.dotUpdate("metaData.shipping.id", resp?.addressId);
        zus.dotUpdate("metaData.salesProfileId", Number(resp?.profileId));
        zus.dotUpdate("metaData.tax.taxCode", resp?.taxCode);
        zus.dotUpdate("metaData.paymentTerm", resp?.netTerm);
        setting.taxCodeChanged();
        setTimeout(() => {
          setting.calculateTotalPrice();
        }, 100);
      }
    });
  };
  customerFormStaticCallbacks.created = onCustomerSelect;
  const { params, setParams } = useCreateCustomerParams();
  return (
    <div className="grid sm:grid-cols-2 font-mono gap-4 sm:gap-8">
      <div className="col-span-2 p-4">
        {!customer ? (
          <SelectCustomer onSelect={(e) => onCustomerSelect(e.customerId)}>
            <Button variant="ghost" className="cursor-pointer">
              Select Customer...
            </Button>
          </SelectCustomer>
        ) : (
          <div className="text-sm text-muted-foreground relative">
            <div className="">
              <span>Customer Data</span>
            </div>
            <p>{customer?.name}</p>
            <p>{customer?.phoneNo}</p>
            <p>
              {customer?.address1} {customer.zip_code}
            </p>
            <p>{customer?.email}</p>
            <p>{/* {customer?.} */}</p>
            <div className="absolute flex items-center -mr-5 top-0 right-0">
              <SelectCustomer onSelect={(e) => onCustomerSelect(e.customerId)}>
                <Button size="xs" variant="link">
                  <Icons.Search className="size-4" />
                </Button>
              </SelectCustomer>
              <Button
                onClick={() => {
                  setParams({
                    customerId: customer.id,
                    customerForm: true,
                  });
                }}
                size="xs"
                variant="link"
              >
                <Icons.edit className="size-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function SelectBilling({ children, onSelect }) {}
function SelectCustomer({ children, onSelect }) {
  const [q, setSearch] = useState("");
  const debouncedQuery = useDebounce(q, 800);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<CustomersListData[]>([]);
  useEffect(() => {
    if (debouncedQuery)
      getCustomersAction(debouncedQuery).then((res) => {
        setResult(res || []);
      });
  }, [debouncedQuery]);
  const { params, setParams } = useCreateCustomerParams();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        {children}
        {/* <Button
                    disabled={disabled}
                    aria-expanded={open}
                    size="sm"
                    variant="outline"
                    className="h-8"
                >
                    <Search className="h-4 w-4 text-muted-foreground" />
                </Button> */}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            value={q}
            onValueChange={(v) => {
              setSearch(v);
            }}
            placeholder="Search Address..."
          />
          <CommandList></CommandList>
        </Command>
        <ScrollArea className="max-h-[30vh] max-w-[400px] overflow-auto">
          <div className="divide-y">
            <button
              onClick={(e) => {
                setParams({
                  customerForm: true,
                });
              }}
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground space-y-1"
            >
              <Label className="text-sm font-medium text-primary truncate">
                Create Customer
              </Label>
            </button>
            {result?.map((address, key) => (
              <button
                key={key}
                onClick={() => {
                  onSelect(address);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground space-y-1"
              >
                <Label className="text-sm font-medium text-primary truncate">
                  {address.name}
                </Label>
                <div className="text-xs text-muted-foreground truncate">
                  {address.phone}
                  {address.address}
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                  {address.taxName && (
                    <span className="px-1 py-0.5 bg-muted rounded text-muted-foreground">
                      {address.taxName}
                    </span>
                  )}
                  {address.profileName && (
                    <span className="px-1 py-0.5 bg-muted rounded text-muted-foreground">
                      {address.profileName}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
