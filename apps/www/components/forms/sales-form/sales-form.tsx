import { useFormDataStore } from "@/app/(clean-code)/(sales)/sales-book/(form)/_common/_stores/form-data-store";
import ItemSection from "@/app/(clean-code)/(sales)/sales-book/(form)/_components/item-section";
import {
    zhAddItem,
    zhInitializeState,
} from "@/app/(clean-code)/(sales)/sales-book/(form)/_utils/helpers/zus/zus-form-helper";
import { Icons } from "@/components/_v1/icons";
import Button from "@/components/common/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { SalesMetaForm } from "./sales-meta-form";
import useEffectLoader from "@/lib/use-effect-loader";

export function SalesFormClient({ data }) {
    const zus = useFormDataStore();
    useEffectLoader(
        () => {
            zus.dotUpdate("currentTab", "invoice");
        },
        {
            wait: 200,
        }
    );

    if (!zus.formStatus) return <></>;
    return (
        <div className="xl:flex w-full xl:gap-4 p-4 xl:p-8 min-h-screen bg-white">
            <div className="flex-1">
                <div className={cn()}>
                    {zus.sequence?.formItem?.map((uid) => (
                        <ItemSection key={uid} uid={uid} />
                    ))}
                    <div className="flex mt-4 justify-end">
                        <Button
                            onClick={() => {
                                zhAddItem();
                            }}
                        >
                            <Icons.add className="size-4 mr-2" />
                            <span>Add</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="xl:w-[350px] relative">
                <div className="sticky flex flex-col w-full top-16">
                    <div className="">
                        <SalesMetaForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
