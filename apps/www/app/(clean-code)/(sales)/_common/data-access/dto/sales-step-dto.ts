import { DykeStepMeta } from "@/app/(v2)/(loggedIn)/sales-v2/type";
import { StepMeta } from "../../../types";

export function transformSalesStepMeta<T>(step: T) {
    let stepMeta = (step as any).meta as StepMeta;
    if (!stepMeta) stepMeta = {} as any;

    if (!stepMeta.priceStepDeps) {
        stepMeta.priceStepDeps = Object.entries(
            (stepMeta as any).priceDepencies || {}
        )
            ?.map(([k, v]) => (v ? k : null))
            .filter(Boolean);
    }
    return {
        ...step,
        meta: stepMeta,
    };
}
