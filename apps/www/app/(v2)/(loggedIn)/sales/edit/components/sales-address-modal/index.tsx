import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useTransition } from "react";
import { useForm, useFormContext } from "react-hook-form";
import salesData from "../../../sales-data";
import InputControl from "@/_v2/components/common/input-control";
import { ISalesAddressForm } from "@/types/sales";
import AutoComplete from "@/components/_v1/common/auto-complete";
import { Label } from "@/components/ui/label";
import { _getCustomerSearchList } from "../../../_data-access/get-customer-search.dac";
import { ICustomer } from "@/types/customers";
import Btn from "@/components/_v1/btn";
import { deepCopy } from "@/lib/deep-copy";
import { toast } from "sonner";
import { saveSalesAddressAction } from "../../../_actions/save-sales-address";
import { usePathname } from "next/navigation";
import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import { updateSalesAddress } from "../../../_actions/update-sales-address";
import FormInput from "@/components/common/controls/form-input";
import { useModal } from "@/components/common/modal/provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SalesAddressModal({ form: mainForm }) {
    // const mainForm = useFormContext();
    // const ctx = useContext(SalesFormContext);
    const { billingAddress, shippingAddress, customer, ...restData } =
        mainForm.getValues();

    const addressForm = useForm<ISalesAddressForm>({
        defaultValues: {
            sameAddress: billingAddress?.id == shippingAddress?.id,
            profile: {},
            billingAddress,
            shippingAddress,
            customer,
        },
    });
    const modal = useModal();
    const [tab, setTab] = useState("billingAddress");
    const checked = addressForm.watch("sameAddress");
    const [saving, startTransition] = useTransition();

    const path = usePathname();

    async function save() {
        const isDyke = path.includes("sales-v2");
        startTransition(async () => {
            const {
                billingAddress, //: ,
                shippingAddress, //: { customerId: scid, ...siad },
                customer,
                // profile,
                ...formData
            } = deepCopy<any>(addressForm.getValues());
            if (!billingAddress?.name || !billingAddress.phoneNo) {
                toast.error("Name and Phone is required");
                return;
            }
            const { customerId, search, ...biad } = billingAddress || {};
            const {
                customerId: scid,
                search: ssea,
                ...siad
            } = shippingAddress || {};
            const _form = {
                ...formData,
                shippingAddress: siad,
                billingAddress: biad,
                // sameAddress: checked as any,
                customer,
            };
            console.log({ _form });
            const resp = await saveSalesAddressAction({ ..._form } as any);
            if (resp) {
                const {
                    profile,
                    customerId,
                    billingAddressId,
                    shippingAddressId,
                    billingAddress,
                    shippingAddress,
                    customer,
                    ...ext
                } = resp;

                const respData = {
                    ...(isDyke
                        ? {
                              "order.customerProfileId": profile?.id,
                              "order.customerId": customerId,
                              "order.billingAddressId": billingAddressId,
                              "order.shippingAddressId": shippingAddressId,
                              shippingAddress,
                              billingAddress,
                              customer,
                          }
                        : {
                              "meta.sales_profile": profile?.title,
                              customerId,
                              billingAddressId,
                              shippingAddressId,
                              billingAddress,
                              shippingAddress,
                              customer,
                          }),
                };

                Object.entries(respData).map(([k, v]) => {
                    mainForm.setValue(k as any, v, {
                        shouldDirty: true,
                    });
                });
                let id = mainForm.getValues("order.id");

                if (isDyke && id) {
                    await updateSalesAddress(
                        id,
                        customerId,
                        billingAddressId,
                        shippingAddressId
                    );
                }
                // closeModal();
                modal?.close();
            }
            console.log({ resp });
        });
    }
    // const [checked, setChecked] = useState<boolean>(true);
    const tabs = salesData.addressTabs;
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    useEffect(() => {
        (async () => {
            setCustomers((await _getCustomerSearchList()).items as any);
        })();
    }, []);

    return (
        <DialogContent>
            <Form {...addressForm}>
                <Tabs defaultValue={tab} className="">
                    <TabsList className="grid w-full grid-cols-2">
                        {tabs.map((t) => (
                            <TabsTrigger
                                key={t.name}
                                onClick={() => setTab("billingAddress")}
                                value={t.value}
                                disabled={
                                    checked && t.value == "shippingAddress"
                                }
                            >
                                {t.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((t) => (
                        <TabsContent value={t.value} key={t.name}>
                            <ScrollArea className="max-h-[70vh] overflow-auto -mr-4 pr-4 pb-8 pt-4">
                                <AddressForm
                                    customers={customers}
                                    formKey={t.value as any}
                                />
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>
                <DialogFooter className="flex justify-end">
                    <div className="flex-1 flex items-center justify-between">
                        <InputControl
                            label="Same as Shipping"
                            check
                            name="sameAddress"
                        />
                        <Btn onClick={save} isLoading={saving} size="sm">
                            Save
                        </Btn>
                    </div>
                </DialogFooter>
            </Form>
        </DialogContent>
    );
}
function AddressForm({
    formKey,
    customers,
}: {
    formKey: "billingAddress" | "shippingAddress";
    customers;
}) {
    const form = useFormContext<ISalesAddressForm>();
    const addressSelected = (e) => {
        const { data: address } = e as any;
        const { customer, businessName, search, ..._address } = address;
        form.setValue(formKey, _address);
        if (customer?.profile && formKey == "billingAddress") {
            form.setValue("profile", customer.profile);
            console.log(customer.profile);
        }
    };
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
                <div className="grid gap-2">
                    <Label>Search</Label>
                    <AutoComplete
                        allowCreate
                        options={customers}
                        itemText={"search"}
                        itemValue={"search"}
                        onSelect={addressSelected}
                        size="sm"
                        // Item={({item}) => <></>}
                    />
                </div>
            </div>
            {formKey == "billingAddress" && (
                <div className="col-span-2 grid grid-cols-4 gap-2">
                    <div className="col-span-3">
                        <FormInput
                            control={form.control}
                            size="sm"
                            name="customer.businessName"
                            label="Business Name"
                        />
                    </div>
                </div>
            )}
            <div className="col-span-2">
                <FormInput
                    control={form.control}
                    size="sm"
                    name={`${formKey}.name`}
                    label="Name"
                />
            </div>
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.phoneNo`}
                label="Phone (Primary)"
            />
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.email`}
                label="Email"
            />
            <div className="col-span-2">
                <FormInput
                    control={form.control}
                    size="sm"
                    name={`${formKey}.address1`}
                    label="Address"
                />
            </div>
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.phoneNo2`}
                label="Phone (Secondary)"
            />
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.city`}
                label="City"
            />
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.state`}
                label="State"
            />
            <FormInput
                control={form.control}
                size="sm"
                name={`${formKey}.meta.zip_code`}
                label="Zip Code"
            />
        </div>
    );
}
