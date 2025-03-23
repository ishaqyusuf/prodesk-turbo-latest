"use client";

import { ModalName } from "@/store/slicers";
import { ICommunityTemplate, ICostChart } from "@/types/community";
import {
    Cell,
    PrimaryCellContent,
    SecondaryCellContent,
} from "../columns/base-columns";
import Money from "../money";
import { openModal } from "@/lib/modal";
import { Badge } from "../../ui/badge";
import { groupArray } from "@/lib/utils";
import dayjs from "dayjs";

interface Props {
    costs: ICostChart[];
    modal: ModalName;
    row;
}
export default function ModelCostCell({ costs, modal, row }: Props) {
    const cost: ICostChart = costs?.find((c) => c.current) as any;

    let money = cost?.meta?.grandTotal;
    return (
        <Cell
            className="cursor-pointer"
            onClick={() => {
                openModal(modal, row);
            }}
        >
            {
                <>
                    <PrimaryCellContent>
                        {!cost ? (
                            <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">
                                Set Cost
                            </Badge>
                        ) : (
                            <Money value={money} />
                        )}
                    </PrimaryCellContent>
                    {costs?.length ? (
                        <SecondaryCellContent>
                            {costs?.length} cost history
                        </SecondaryCellContent>
                    ) : (
                        <></>
                    )}
                </>
            }
        </Cell>
    );
}
export function CommunityModelCostCell({ row }: { row: ICommunityTemplate }) {
    const cost = row.meta?.modelCost;
    let money = cost?.grandTotal;
    return (
        <Cell
            className="cursor-pointer rtl"
            onClick={() => {
                openModal("modelCost", row);
            }}
        >
            {!cost ? (
                <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">
                    Set Cost
                </Badge>
            ) : (
                <>
                    <PrimaryCellContent>
                        <Money value={money} />
                    </PrimaryCellContent>
                </>
            )}
        </Cell>
    );
}
