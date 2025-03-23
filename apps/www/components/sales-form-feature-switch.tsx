"use client";

import { useSalesFormFeatureParams } from "@/hooks/use-sales-form-feature-params";
import Portal from "./_v1/portal";
import { Button } from "./ui/button";

export function SalesFormFeatureSwitch() {
    const { params, setParams } = useSalesFormFeatureParams();
    return (
        <Portal nodeId={"navRightSlot"}>
            <Button
                onClick={(e) => {
                    setParams(
                        params.newInterface
                            ? null
                            : {
                                  newInterface: true,
                              }
                    );
                }}
                className="relative h-8  rounded-lg   gradient-border overflow-hidden"
                size="sm"
            >
                {params.newInterface ? "v1" : "v1.2"}
            </Button>
        </Portal>
    );
}
