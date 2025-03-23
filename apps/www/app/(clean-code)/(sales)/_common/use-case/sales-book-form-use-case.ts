"use server";

import { AsyncFnType } from "@/app/(clean-code)/type";
import {
    createSalesBookFormDataDta,
    GetSalesBookFormDataProps,
    getTransformedSalesBookFormDataDta,
} from "../data-access/sales-form-dta";
import { composeStepRouting } from "../utils/sales-step-utils";
import {
    loadSalesFormData,
    saveSalesSettingData,
} from "../data-access/sales-form-settings.dta";
import { composeSalesPricing } from "../utils/sales-pricing-utils";
import { getPricingListDta } from "../data-access/sales-pricing-dta";
import { SalesFormFields, SalesType } from "../../types";
import { saveSalesFormDta } from "../data-access/save-sales/index.dta";
import { zhInitializeState } from "../../sales-book/(form)/_utils/helpers/zus/zus-form-helper";
import { deleteSaleUseCase } from "@/use-cases/sales";
import { prisma } from "@/db";
import { SaveQuery } from "../data-access/save-sales/save-sales-class";
import { deleteSalesByOrderId, deleteSalesDta } from "../data-access/sales-dta";
import { copySalesDta } from "../data-access/save-sales/copy-sales-dta";
import { redirect } from "next/navigation";

export type GetSalesBookForm = AsyncFnType<typeof getSalesBookFormUseCase>;
export async function getSalesBookFormUseCase(data: GetSalesBookFormDataProps) {
    const result = await getTransformedSalesBookFormDataDta(data);
    return await composeBookForm(result);
}
async function composeBookForm<T>(data: T) {
    return {
        ...data,
        salesSetting: composeStepRouting(await loadSalesFormData()),
        pricing: composeSalesPricing(await getPricingListDta()),
    };
}
export async function createSalesBookFormUseCase(
    data: GetSalesBookFormDataProps
) {
    const resp = await createSalesBookFormDataDta(data);
    return await composeBookForm(resp);
    // return salesFormZustand(resp);
    // return {
    //     ...resp,
    //     salesSetting: composeStepRouting(await loadSalesFormData()),
    // };
}
export async function saveSalesSettingUseCase(meta) {
    await saveSalesSettingData(meta);
}

export async function saveFormUseCase(
    data: SalesFormFields,
    oldFormState?: SalesFormFields,
    query?: SaveQuery
    // allowRedirect = true
) {
    if (!oldFormState)
        oldFormState = {
            kvFormItem: {},
            kvStepForm: {},
            sequence: {
                formItem: [],
                multiComponent: {},
                stepComponent: {},
            },
            metaData: {} as any,
        };

    return await saveSalesFormDta(data, oldFormState, query);
}
export async function moveOrderUseCase(orderId, to) {
    const resp = await copySalesUseCase(orderId, to);
    if (!resp?.error) await deleteSalesByOrderId(orderId);
    return resp;
}
export async function copySalesUseCase(orderId, as: SalesType) {
    const resp2 = await copySalesDta(orderId, as);
    const link = resp2?.isDyke ? `/sales-book/edit-${as}/${resp2.slug}` : ``;
    // if (link) redirect(link);
    return {
        error: resp2?.error,
        link,
        data: resp2,
    };
    // return resp2;

    const form = await getSalesBookFormUseCase({
        slug: orderId,
    });

    form.order.type = as;
    const formData = zhInitializeState(form, true);

    const { kvFormItem, kvStepForm, metaData, sequence } = formData;
    // console.log(metaData)
    const resp = await saveFormUseCase(
        {
            kvFormItem,
            kvStepForm,
            metaData,
            sequence,
        },
        formData.oldFormState,
        {
            restoreMode: false,
            allowRedirect: false,
            copy: true,
        }
    );

    return {
        error: resp.data?.error,
        link: `/sales-book/edit-${as}/${resp.slug}`,
        data: resp,
    };
}
