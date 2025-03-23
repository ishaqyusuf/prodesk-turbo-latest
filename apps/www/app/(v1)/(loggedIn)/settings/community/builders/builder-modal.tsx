"use client";

import React, { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import Btn from "../../../../../../components/_v1/btn";
import BaseModal from "../../../../../../components/_v1/modals/base-modal";
import { closeModal } from "@/lib/modal";
import { toast } from "sonner";

import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { IBuilder } from "@/types/community";
import { Checkbox } from "../../../../../../components/ui/checkbox";
import { Button } from "../../../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";
import { chunkArray, generateRandomString } from "@/lib/utils";
import { saveBuilder, saveBuilderInstallations } from "./action";
import { Form, FormField } from "../../../../../../components/ui/form";
import { CheckedState } from "@radix-ui/react-checkbox";
import { _updateBuilderMetaAction } from "@/app/(v2)/(loggedIn)/community-settings/builders/_actions/update-builder-action";
import {
    _getBuilderHomeIds,
    _syncBuilderTasks,
} from "@/app/(v2)/(loggedIn)/community-settings/builders/_actions/save-builder-task-action";
import { toastArrayAction } from "@/lib/toast-util";
import { useModal } from "@/components/common/modal/provider";
import Modal from "@/components/common/modal";
import FormInput from "@/components/common/controls/form-input";
import { _revalidate } from "@/app/(v1)/_actions/_revalidate";

export const useBuilderModal = () => {
    const modal = useModal();
    return {
        create(type: Props["type"] = "main") {
            modal.openModal(<BuilderModal type={type} />);
        },
        edit(data) {
            modal.openModal(<BuilderModal type={"main"} data={data} />);
        },
        editTasks(data) {
            modal.openModal(<BuilderModal type={"tasks"} data={data} />);
        },
    };
};
interface Props {
    data?;
    type: "main" | "tasks" | "installations";
}
export default function BuilderModal({
    type,
    data = {
        meta: {
            tasks: [],
        },
    },
}: Props) {
    const route = useRouter();
    const [isSaving, startTransition] = useTransition();
    const form = useForm<IBuilder>({
        defaultValues: {
            ...(data ? data : {}),
        },
    });
    const [taskIds, setTaskIds] = useState(
        data?.meta?.tasks?.map((t) => t.uid) || []
    );
    const modal = useModal();
    async function save() {
        startTransition(async () => {
            // if(!form.getValues)
            const data = form.getValues();

            try {
                if (type == "main" || !type) {
                    await saveBuilder(data);
                }
                if (type == "tasks") {
                    let { tasks, ...meta } = data.meta;
                    const newTaskIds: any = [];
                    let deleteIds: any = [...taskIds];
                    if (Array.isArray(tasks)) {
                        data.meta.tasks = tasks.map((t) => {
                            if (!t.uid) {
                                t.uid = generateRandomString(4);
                                newTaskIds.push(t.uid);
                            }
                            deleteIds = deleteIds.filter((d) => d != t.uid);
                            return t;
                        });
                    }
                    const b = await _updateBuilderMetaAction(
                        data.meta,
                        data.id
                    );
                    const homeIds = await _getBuilderHomeIds(data.id);

                    const a = await chunkArray(
                        homeIds.map(({ id }) => id),
                        500
                    );
                    // console.log(a[0]);
                    await toastArrayAction({
                        items: a,
                        serverAction: async (units) =>
                            await _syncBuilderTasks(
                                data,
                                deleteIds,
                                newTaskIds,
                                units
                            ),
                        loading(item) {
                            return "Synchronizing....";
                        },
                    });
                    // return;
                    // // console.log(deleteIds, newTaskIds);
                    // await saveBuilderTasks(data, deleteIds, newTaskIds);
                }
                if (type == "installations")
                    await saveBuilderInstallations(data);

                modal.close();
                toast.message("Success!");
                await _revalidate("builders");
            } catch (error) {
                // console.log(error);
                if (error instanceof Error) toast.error(error.message);
                else toast.message("Invalid Form");

                return;
            }
        });
    }
    return (
        <Modal.Content size={type == "main" ? "sm" : "xl"}>
            <Modal.Header title={data?.name || "Builder Form"} />
            <Form {...form}>
                <div className="grid md:grid-cols-2 gap-4">
                    {type == "main" && (
                        <>
                            <FormInput
                                className="col-span-2"
                                control={form.control}
                                name="name"
                                label="Name"
                            />
                            <FormInput
                                className="col-span-2"
                                control={form.control}
                                name="meta.address"
                                label="Address"
                            />
                        </>
                    )}
                    {type == "tasks" && (
                        <div className="col-span-2 grid gap-2">
                            <TasksForm />
                        </div>
                    )}
                </div>
            </Form>
            <Modal.Footer submitText="Save" onSubmit={save} />
        </Modal.Content>
    );
}
function TasksForm({}) {
    const form = useFormContext();
    const { fields, remove, append } = useFieldArray({
        control: form.control,
        name: "meta.tasks",
    });
    return (
        <div className="col-span-2 grid gap-2">
            <div className="grid grid-cols-11 gap-2">
                <Label className="col-span-4">Task Name</Label>
                <Label className="col-span-1 text-center">Bill.</Label>
                <Label className="col-span-1 text-center">Addon.</Label>
                <Label className="col-span-1 text-center">Prod.</Label>
                <Label className="col-span-1 text-center">Contr.</Label>
                <Label className="col-span-1 text-center">Punch.</Label>
                <Label className="col-span-1 text-center">Deco.</Label>
                <Label className="col-span-1"></Label>
            </div>

            {fields?.map((f, i) => (
                <div
                    className="grid grid-cols-11 gap-2 items-center group"
                    key={i}
                >
                    <div className="col-span-4">
                        <Input
                            className="h-7"
                            placeholder=""
                            {...form.register(`meta.tasks.${i}.name` as any)}
                        />
                    </div>

                    {[
                        "bill",
                        "addon",
                        "produceable",
                        "installable",
                        "punchout",
                        "deco",
                    ].map((k) => (
                        <div key={k} className="flex justify-center">
                            <FormField
                                name={`meta.tasks.${i}.${k}` as any}
                                control={form.control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="component"
                                        checked={field.value as CheckedState}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                remove(i);
                            }}
                            variant="ghost"
                            size="icon"
                            className=""
                        >
                            <Trash className="size-4 text-slate-300 group-hover:text-red-600" />
                        </Button>
                    </div>
                </div>
            ))}
            <Button
                onClick={() => {
                    append({} as any);
                }}
                variant="secondary"
                className="w-full h-7 mt-1"
            >
                <Plus className="mr-2 size-4" />
                <span>Add Line</span>
            </Button>
        </div>
    );
}
