"use client";

import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema } from "@/actions/schema";
import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import FormInput from "../common/controls/form-input";
import FormSelect from "../common/controls/form-select";
import useEffectLoader from "@/lib/use-effect-loader";
import { getCustomerProfilesAction } from "@/actions/cache/get-customer-profiles";
import salesData from "@/app/(clean-code)/(sales)/_common/utils/sales-data";
import { Button } from "../ui/button";
import { SubmitButton } from "../submit-button";
import { useAction } from "next-safe-action/hooks";
import { createCustomerAction } from "@/actions/create-customer-action";
import { useCreateCustomerParams } from "@/hooks/use-create-customer-params";
import { getTaxProfilesAction } from "@/actions/cache/get-tax-profiles";
import { toast } from "sonner";

export type CustomerFormData = z.infer<typeof createCustomerSchema>;
type Props = {
    data?: CustomerFormData;
};
export const customerFormStaticCallbacks = {
    created: null,
};
export function CustomerForm({ data }: Props) {
    const [sections, setSections] = useState<string[]>(["general"]);
    const form = useForm<CustomerFormData>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: {
            address1: undefined,
            address2: undefined,
            addressId: undefined,
            businessName: undefined,
            city: undefined,
            country: undefined,
            email: undefined,
            id: undefined,
            name: undefined,
            netTerm: undefined,
            phoneNo: undefined,
            phoneNo2: undefined,
            profileId: undefined,
            state: undefined,
            zip_code: undefined,
            customerType: "Personal",
        },
    });
    const resp = useEffectLoader(
        async () => {
            const re = {
                taxProfiles: await getTaxProfilesAction(),
                salesProfiles: await getCustomerProfilesAction(),
            };
            return re;
        },
        {
            wait: 120,
        }
    );
    const { taxProfiles, salesProfiles } = resp?.data || {};
    const { params, setParams } = useCreateCustomerParams();
    useEffect(() => {
        if (data) {
            setSections(["general", "address"]);
            let formData = {};
            Object.entries(data).map(
                ([k, v]) => (formData[k] = v || undefined)
            );
            form.reset({
                ...formData,
            });
        }
    }, [data, form]);
    const customerType = form.watch("customerType");
    const createCustomer = useAction(createCustomerAction, {
        onSuccess: ({ data: resp }) => {
            console.log(resp);
            toast.success(data?.id ? "Updated" : "Created");
            customerFormStaticCallbacks?.created?.(resp.customerId);

            // if (resp) {
            setParams(null);
            // }
        },
    });

    return (
        <Form {...form}>
            <form
                // onSubmit={form.handleSubmit(__test)}
                onSubmit={form.handleSubmit(createCustomer.execute)}
                className="pb-32 overflow-x-hidden flex flex-col"
            >
                <div className="">
                    <Accordion
                        key={sections.join("-")}
                        type="multiple"
                        defaultValue={sections}
                        className="space-y-6"
                    >
                        <AccordionItem value="general">
                            <AccordionTrigger>General</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <FormSelect
                                        placeholder="Customer Type"
                                        control={form.control}
                                        name="customerType"
                                        label="Customer Type"
                                        size="sm"
                                        options={["Personal", "Business"]}
                                    />
                                    {customerType == "Business" ? (
                                        <FormInput
                                            control={form.control}
                                            name="businessName"
                                            label="Business Name"
                                            size="sm"
                                        />
                                    ) : (
                                        <FormInput
                                            control={form.control}
                                            name="name"
                                            label="Name"
                                            size="sm"
                                        />
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            control={form.control}
                                            name="phoneNo"
                                            label="Phone"
                                            size="sm"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="email"
                                            label="Email"
                                            size="sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormSelect
                                            control={form.control}
                                            name="profileId"
                                            label="Customer Profile"
                                            size="sm"
                                            titleKey="title"
                                            valueKey="id"
                                            options={salesProfiles?.map(
                                                (s) => ({
                                                    ...s,
                                                    id: String(s.id),
                                                })
                                            )}
                                        />
                                        <FormSelect
                                            control={form.control}
                                            name="taxCode"
                                            label="Tax Profile"
                                            size="sm"
                                            titleKey="title"
                                            valueKey="taxCode"
                                            options={taxProfiles || []}
                                        />
                                        <FormSelect
                                            size="sm"
                                            label="Net Term"
                                            name="netTerm"
                                            control={form.control}
                                            options={salesData.paymentTerms}
                                            valueKey={"value"}
                                            titleKey={"text"}
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="address">
                            <AccordionTrigger>Address</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <FormInput
                                        control={form.control}
                                        name="address1"
                                        label="Address Line 1"
                                        size="sm"
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="address2"
                                        label="Address Line 2"
                                        size="sm"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            control={form.control}
                                            name="phoneNo2"
                                            label="Secondary Phone"
                                            size="sm"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="city"
                                            label="City"
                                            size="sm"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="state"
                                            label="State / Province"
                                            size="sm"
                                        />
                                        <FormInput
                                            control={form.control}
                                            name="zip_code"
                                            label="Zip Code / Postal Code"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 bg-white">
                    <div className="flex justify-end mt-auto space-x-4">
                        <Button
                            variant="outline"
                            // onClick={() => setCustomerParams(null)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <SubmitButton
                            isSubmitting={createCustomer.isExecuting}
                            disabled={
                                createCustomer.isExecuting ||
                                !form.formState.isValid
                            }
                        >
                            {data?.id ? "Update" : "Create"}
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </Form>
    );
}
