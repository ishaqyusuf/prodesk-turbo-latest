"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAssignmentData } from ".";

import ConfirmBtn from "@/components/_v1/confirm-btn";
import {
    __revalidateProductions,
    _changeAssignmentDueDate,
    _deleteAssignment,
} from "./_action/actions";
import { useAssignment } from "./use-assignment";
import SubmitDoorProduction from "./submit-form";
import { TableCol } from "@/components/common/data-table/table-cells";
import { DatePicker } from "@/components/_v1/date-range-picker";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Props {
    groupIndex;
    doorIndex;
}
export default function DoorAssignments({ doorIndex, groupIndex }: Props) {
    const data = useAssignmentData();
    const group = data.data.doorGroups[groupIndex];
    const modal = useAssignment(
        data.data.isProd ? { type: "prod" } : undefined
    );
    if (!group) return null;
    const salesDoor = group.salesDoors[doorIndex];
    if (!salesDoor || !salesDoor.assignments.length)
        return (
            <div className="flex justify-center text-red-500 py-2 bg-slate-50">
                Items not assigned
            </div>
        );
    async function deleteAssignment(assignment) {
        await _deleteAssignment(assignment);
        modal.open(data.data.id);
        await __revalidateProductions();
    }
    return (
        <div className="">
            <div className="sm:mx-4 sm:ml-10 shidden sm:block">
                <Table className="max-w-[80vw]">
                    <TableHeader className="bg-slate-100">
                        {/* <TableHead>Date</TableHead> */}
                        {!group.doorConfig.singleHandle && (
                            <TableHead>Handle</TableHead>
                        )}
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableHeader>
                    <TableBody>
                        {salesDoor?.assignments?.map((assignment) => (
                            <TableRow key={assignment.id} className="">
                                {/* <TableCell>
                                {formatDate(assignment.createdAt)}
                            </TableCell> */}
                                {!group.doorConfig.singleHandle && (
                                    <TableHead>
                                        {assignment.__report.handle}
                                    </TableHead>
                                )}
                                <TableCell>
                                    {assignment.assignedTo?.name}
                                </TableCell>
                                <TableCell>
                                    {/* <TableCol.Date className="border rounded p-0.5 px-1 shadow-sm">
                                    {assignment.dueDate}
                                </TableCol.Date> */}
                                    <DueDate assignment={assignment} />
                                </TableCell>
                                <TableCell>
                                    {assignment.__report.submitted} of{" "}
                                    {assignment.__report.total}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        {!assignment.submissions?.length ? (
                                            <TableCol.Status />
                                        ) : (
                                            <TableCol.Status
                                                score={
                                                    assignment.__report
                                                        .submitted
                                                }
                                                total={
                                                    assignment.__report.total
                                                }
                                                status={assignment.status}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-2 justify-end items-center">
                                    <SubmitDoorProduction
                                        groupIndex={groupIndex}
                                        isGarage={group.isType.garage}
                                        assignment={assignment}
                                        salesDoor={salesDoor}
                                    ></SubmitDoorProduction>
                                    {data.data.isProd ? (
                                        <></>
                                    ) : (
                                        <ConfirmBtn
                                            trash
                                            disabled={data.data.readOnly}
                                            size={"icon"}
                                            onClick={() =>
                                                deleteAssignment(assignment)
                                            }
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function DueDate({ assignment }) {
    const data = useAssignmentData();
    const [dueDate, setDueDate] = useState(assignment.dueDate);

    async function selectDate(e) {
        setDueDate(e);
        await _changeAssignmentDueDate(assignment.id, e);
        toast.success("Date Changed");
        await __revalidateProductions();
    }
    if (data.data.isProd)
        return <TableCol.Date>{assignment.dueDate}</TableCol.Date>;
    return (
        <>
            <DatePicker
                value={dueDate}
                setValue={selectDate}
                hideIcon
                className="w-28 px-1 h-7"
            />
        </>
    );
}
