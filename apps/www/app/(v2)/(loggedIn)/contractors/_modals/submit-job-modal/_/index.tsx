"use client";

import { HomeJobList, IJobs } from "@/types/hrm";
import { useFormContext } from "react-hook-form";

import { useJobSubmitCtx } from "./use-submit-job";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectUserField from "./select-user-field";
import TaskDetailsTab from "./task-details-tab";
import { InstallCostLine } from "@/types/settings";
import Btn from "@/components/_v1/btn";
import GeneralInfoTab from "./general-info-tab";

import { Form } from "@/components/ui/form";

export type SubmitJobTabs = "project" | "user" | "unit" | "tasks" | "general";
export type JobFormAction = "edit" | "change-worker";

export interface SubmitJobForm {
    job: IJobs;
    data: IJobs;
    tab: SubmitJobTabs;
    action: JobFormAction;
    tabHistory: { title }[];
    homes: HomeJobList[];
    home: HomeJobList;
    costList: InstallCostLine[];
    // initialized: boolean;
}
export const useSubmitJobForm = () => useFormContext<SubmitJobForm>();

export interface SubmitJobModalDataProps {
    data: IJobs;
    action: JobFormAction;
}
export interface SubmitJobModalProps {
    data?: SubmitJobModalDataProps;
}
function ModalContent({ data }: SubmitJobModalProps) {
    const ctx = useJobSubmitCtx();

    // useEffect(() => {
    // console.log(">...");
    // ctx.initialize(data);
    // }, []);
    return (
        <Form {...ctx.form}>
            <Tabs value={ctx.tab}>
                <TabsList className="hidden">
                    <TabsTrigger value="user" />
                    <TabsTrigger value="project" />
                    <TabsTrigger value="unit" />
                    <TabsTrigger value="tasks" />
                    <TabsTrigger value="general" />
                </TabsList>
                <TabsContent value="user">
                    <SelectUserField />
                </TabsContent>
                <TabsContent value="tasks">
                    <TaskDetailsTab />
                </TabsContent>
                <TabsContent value="general">
                    <GeneralInfoTab />
                </TabsContent>
            </Tabs>
        </Form>
    );
}
export const SubmitJobModalContent = ModalContent;
function ModalFooter({ data }: SubmitJobModalProps) {
    const ctx = useJobSubmitCtx();
    return (
        <div className="space-x-4 items-center flex">
            <Btn isLoading={ctx.isLoading} onClick={ctx.nextTab}>
                Submit
            </Btn>
        </div>
    );
}
export const SubmitJobModalFooter = ModalFooter;
