"use client";

import React, { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import BaseSheet from "../../../../../../components/_v1/sheets/base-sheet";
import { IJobs } from "@/types/hrm";
import { Info } from "../../../../../../components/_v1/info";
import {
    DateCellContent,
    PrimaryCellContent,
    SecondaryCellContent,
} from "../../../../../../components/_v1/columns/base-columns";
import Money from "../../../../../../components/_v1/money";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../../../components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "../../../../../../components/ui/input";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";
import { getSettingAction } from "@/app/(v1)/_actions/settings";
import { InstallCostLine, InstallCostSettings } from "@/types/settings";
import { Button } from "../../../../../../components/ui/button";
import { openModal } from "@/lib/modal";
import Modal from "@/components/common/modal";
import { useModal } from "@/components/common/modal/provider";
import SubmitJobModal from "@/app/(v2)/(loggedIn)/contractors/_modals/submit-job-modal";

interface Props {
    admin?: boolean;
    job: IJobs;
}
export default function JobOverviewSheet({ admin, job }: Props) {
    const route = useRouter();
    const [isSaving, startTransition] = useTransition();

    async function init(data) {}
    const modal = useModal();
    return (
        <Modal.Content>
            <Modal.Header
                title={job.title}
                subtitle={
                    <div className="flex justify-between">
                        <span>{job.subtitle}</span>
                        <Button
                            onClick={() => {
                                modal.openModal(<SubmitJobModal job={job} />);
                            }}
                            variant={"default"}
                            className="px-2 h-6"
                            size={"sm"}
                        >
                            <span>Edit</span>
                        </Button>
                    </div>
                }
            ></Modal.Header>
            <ScrollArea className="h-screen ">
                <div className="grid grid-cols-2 items-start gap-4 text-sm mt-6 mb-28">
                    <Content data={job as any} />
                </div>
            </ScrollArea>
        </Modal.Content>
    );
    return (
        <BaseSheet<IJobs>
            className="w-full sm:max-w-[550px]"
            onOpen={(data) => {
                init(data);
            }}
            onClose={() => {}}
            modalName="jobOverview"
            Title={({ data }) => (
                <div>
                    <div className="">{data?.title}</div>
                </div>
            )}
            Description={({ data }) => (
                <div className="flex justify-between">
                    <div>{data?.subtitle}</div>
                    <div className="relative">
                        <div className="">
                            {admin && (
                                <Button
                                    onClick={() => {
                                        openModal("submitJob", {
                                            data: data,
                                            defaultTab: "tasks",
                                        });
                                    }}
                                    variant={"default"}
                                    className="px-2 h-6"
                                    size={"sm"}
                                >
                                    <span>Edit</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            Content={({ data }) => (
                <div>
                    <ScrollArea className="h-screen ">
                        <div className="grid grid-cols-2 items-start gap-4 text-sm mt-6 mb-28">
                            <Content data={data as any} />
                        </div>
                    </ScrollArea>
                </div>
            )}
            //   Footer={({ data }) => (
            //     <Btn
            //       isLoading={isSaving}
            //       onClick={() => submit()}
            //       size="sm"
            //       type="submit"
            //     >
            //       Save
            //     </Btn>
            //   )}
        />
    );
}
function Content({ data }: { data: IJobs }) {
    const [job, setJob] = useState<IJobs>(data);
    const [costSetting, setCostSetting] = useState<InstallCostSettings>(
        {} as any
    );
    useEffect(() => {
        getSettingAction<InstallCostSettings>("install-price-chart").then(
            (res) => {
                setCostSetting(res);
            }
        );
    }, []);
    const [divider, setDivider] = useState(data?.coWorkerId ? 2 : 1);
    const [showAll, setShowAll] = useState(false);
    if (!data) return <></>;
    return (
        <>
            <section
                id="info"
                className="grid grid-cols-2 items-start gap-4 col-span-2"
            >
                <Info label="Done By">
                    <p>{data?.user?.name}</p>
                    <DateCellContent>{data?.user?.createdAt}</DateCellContent>
                </Info>
                <Info label="Job Type">
                    <p>{data?.type}</p>
                </Info>
                <Info label="Additional Cost">
                    <Money value={data?.meta?.additional_cost / divider} />
                    <div className="">{data?.description}</div>
                </Info>
                <Info label="Addon Cost">
                    <Money value={job?.meta?.addon / divider} />
                </Info>
                <Info label="Total Cost">
                    <Money value={job?.amount} />
                </Info>
                <Info label="Payment">
                    {job?.payment ? (
                        <>
                            <p>{job?.payment.checkNo}</p>
                            <DateCellContent>
                                {job?.payment.createdAt}
                            </DateCellContent>
                        </>
                    ) : (
                        <>No payment</>
                    )}
                </Info>
                <Info className="col-span-2" label="Job Comment">
                    <div>{data?.note || "No Comment"}</div>
                </Info>
            </section>
            {job.meta?.costData && (
                <div className="col-span-2">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-1">Task</TableHead>
                                <TableHead className="px-1">Qty</TableHead>
                                <TableHead className="px-1">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costSetting?.meta?.list
                                ?.filter(
                                    (l) =>
                                        (job.meta?.costData[l.uid]?.qty || 0) >
                                        0
                                )
                                .map((cd, i) => (
                                    <TaskRow
                                        key={i}
                                        job={job}
                                        index={i}
                                        setJob={setJob}
                                        row={cd}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
}
interface TaskRowProps {
    row: InstallCostLine;
    job: IJobs;
    index;
    setJob;
}
function TaskRow({ row, index, job, setJob }: TaskRowProps) {
    const { cost, qty: __qty } = job.meta?.costData[row.uid] as any;
    const [qty, setQty] = useState(__qty);
    const [dVal, setDVal] = useState(false);
    const [divider, setDivider] = useState(job?.coWorkerId ? 2 : 1);
    useEffect(() => {
        if (qty != job.meta?.costData[row.uid]?.qty) setDVal(qty);
    }, [qty, job]);
    const deb = useDebounce(dVal, 800);
    useEffect(() => {
        // console.log(deb);
    }, [deb]);
    function blurred(e) {
        // console.log("BLURRED VALUE", qty);
    }
    return (
        <TableRow>
            <TableCell className="px-1">
                <PrimaryCellContent>{row.title}</PrimaryCellContent>
                <SecondaryCellContent>
                    <Money value={cost || row.cost} />
                </SecondaryCellContent>
            </TableCell>
            <TableCell className="px-1">
                <Input
                    onBlur={blurred}
                    disabled
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    type="number"
                    className="w-16 h-8"
                />
            </TableCell>
            <TableCell className="px-1">
                <SecondaryCellContent>
                    <Money value={qty * (cost || row.cost)} />
                </SecondaryCellContent>
            </TableCell>
        </TableRow>
    );
}
