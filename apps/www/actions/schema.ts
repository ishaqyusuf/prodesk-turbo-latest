import { z } from "zod";

export const changeSalesChartTypeSchema = z.enum(["sales"]);

export const createCustomerSchema = z
    .object({
        profileId: z.string(),
        id: z.number().optional(),
        phoneNo: z.string().optional(),
        phoneNo2: z.string().optional(),
        email: z.string().optional(),
        address1: z.string().optional().nullable(),
        address2: z.string().optional(),
        name: z.string().optional(),
        businessName: z.string().optional(),
        addressId: z.number().optional(),
        zip_code: z.string().optional(),
        taxCode: z.string().optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        taxProfileId: z.number().optional(),
        netTerm: z.string().optional(),
        customerType: z.enum(["Personal", "Business"]),
    })
    .superRefine((data, ctx) => {
        if (data.customerType === "Personal" && !data.name) {
            ctx.addIssue({
                path: ["name"],
                message: "Name is required for Individual customers",
                code: "custom",
            });
        }

        if (data.customerType === "Business" && !data.businessName) {
            ctx.addIssue({
                path: ["businessName"],
                message: "Business Name is required for Business customers",
                code: "custom",
            });
        }
    });
export const createPaymentSchema = z
    .object({
        paymentMethod: z.enum([
            "link",
            "terminal",
            "check",
            "cash",
            "zelle",
            "credit-card",
            "wire",
        ]),
        amount: z.number(),
        checkNo: z.string().optional(),
        deviceId: z.string().optional(),
        enableTip: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.paymentMethod === "check" && !data.checkNo) {
            ctx.addIssue({
                path: ["checkNo"],
                message: "Check No is required",
                code: "custom",
            });
        }
        if (data.paymentMethod === "terminal" && !data.deviceId) {
            ctx.addIssue({
                path: ["deviceId"],
                message: "Device Id is required",
                code: "custom",
            });
        } else {
        }
    });
