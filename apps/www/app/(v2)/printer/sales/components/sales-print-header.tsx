"use client";

import { Icons } from "@/components/_v1/icons";
import { useSalesBlockCtx } from "../sales-print-block";
import Text from "../../components/print-text";
import React from "react";
import { cn } from "@/lib/utils";

export default function SalesPrintHeader() {
    const ctx = useSalesBlockCtx();
    const { sale } = ctx;

    return (
        <thead id="topHeader">
            <tr className="">
                <td colSpan={16}>
                    <table className="w-full  font-mono table-fixed text-xs">
                        <tbody>
                            <tr className="">
                                <td colSpan={9} valign="top">
                                    <Icons.PrintLogo />
                                </td>
                                <td valign="top" colSpan={5}>
                                    <div className="text-xs font-semibold text-black/90">
                                        <p>13285 SW 131 ST</p>
                                        <p>Miami, Fl 33186</p>
                                        <p>Phone: 305-278-6555</p>
                                        {ctx.sale.isProd && (
                                            <p>Fax: 305-278-2003</p>
                                        )}
                                        <p>support@gndmillwork.com</p>
                                    </div>
                                </td>
                                <td colSpan={1}></td>
                                <td valign="top" colSpan={9}>
                                    <p className="text-black mb-1 text-end text-xl font-bold capitalize">
                                        {sale?.headerTitle}
                                    </p>
                                    <table className="w-full table-fixed">
                                        <tbody>
                                            {sale?.heading?.lines?.map((h) => (
                                                <tr key={h.title}>
                                                    <td
                                                        colSpan={3}
                                                        valign="bottom"
                                                        className="font-bold"
                                                    >
                                                        {h.title}
                                                    </td>
                                                    <td
                                                        colSpan={5}
                                                        align="right"
                                                    >
                                                        <Text {...h.style}>
                                                            {h.value}
                                                        </Text>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr className="">
                                {sale?.address?.map((address, index) => (
                                    <React.Fragment key={address?.title}>
                                        {index == 1 && (
                                            <td colSpan={6} className="">
                                                {!sale.paymentDate || (
                                                    <div className="sabsolute watermark-text text-strokes   -rotate-45 -translate-y-6 translate-x-8 font-mono uppercase font-bold inline-flex flex-col ">
                                                        <span className="text-5xl">
                                                            Paid
                                                        </span>
                                                        <span className="text-2xl">
                                                            {sale.paymentDate}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                        <td colSpan={9} key={address?.title}>
                                            <div
                                                className={cn(
                                                    "my-4  mb-4 flex flex-col"
                                                )}
                                            >
                                                <div>
                                                    <span className="p-1 px-2 border border-b-0 border-gray-400 bg-slate-200 text-gray-700 text-sm  font-bold">
                                                        {address?.title}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col p-2 border border-gray-400">
                                                    {address?.lines?.map(
                                                        (f, _) => {
                                                            return (
                                                                <p
                                                                    key={_}
                                                                    className="sline-clamp-2 text-sm font-medium"
                                                                >
                                                                    {f}
                                                                </p>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </thead>
    );
}
