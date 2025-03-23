import Modal from "@/components/common/modal";
import { DykeForm } from "../../../../type";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/common/controls/form-select";
import Btn from "@/components/_v1/btn";
import { useTransition } from "react";
import { updateSettingsMeta } from "@/app/(v1)/_actions/settings";
import useFn from "@/hooks/use-fn";
import { getDykeSections } from "../../../../_actions/dyke-settings/get-dyke-sections";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useModal } from "@/components/common/modal/provider";
interface Props {
    // data?: DykeForm["data"]["settings"];
    form: UseFormReturn<DykeForm>;
}
export default function DykeSettingsModal({ form }: Props) {
    // const sections = form.watch("data.settings.selectedCustomInputs");
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `data.settings.dyke.customInputSection.sections`,
    });
    const [saving, startTransition] = useTransition();
    const modal = useModal();
    function save() {
        startTransition(async () => {
            const data = form.getValues("data.settings");
            // console.log(data);
            await updateSettingsMeta(data);
            toast.message("Saved");
            modal.close();
        });
    }
    const sections = useFn(getDykeSections);
    return (
        <Form {...form}>
            <Modal.Content>
                <Modal.Header title="Settings" />
                <div className="grid gap-4">
                    <div className="sflex hidden flex-wrap items-center">
                        <Label>Custom Input Sections:</Label>
                        {fields.map((f, index) => (
                            <div className="m-1.5" key={f.id}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            onClick={(e) => {
                                                remove(index);
                                            }}
                                        >
                                            <span className=" hover:bg-slate-200 p-1 rounded-lg text-muted-foreground hover:text-destructive">
                                                <span className="">
                                                    {f.name}
                                                </span>
                                                {<span>, </span>}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Click to delete
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))}
                        <div className="w-28">
                            <FormSelect
                                control={form.control}
                                type="combo"
                                name={`data.settings.dyke.customInputSection._sectionSelect`}
                                className=""
                                size="sm"
                                onSelect={(e) => {
                                    console.log(e);
                                    const index = fields.findIndex(
                                        (f) => f.name == (e as any)
                                    );

                                    if (index >= 0) remove(index);
                                    else
                                        append({
                                            name: e as any,
                                        });
                                    form.setValue(
                                        "data.settings.dyke.customInputSection._sectionSelect",
                                        null
                                    );
                                }}
                                options={
                                    sections?.data?.map((d) => ({
                                        label: d.title,
                                        value: d.title,
                                    })) || []
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Btn isLoading={saving} onClick={save}>
                            Save
                        </Btn>
                    </div>
                </div>
            </Modal.Content>
        </Form>
    );
}
