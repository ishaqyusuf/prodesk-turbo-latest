import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/store";
import { ISalesSetting } from "@/types/post";
import { UseFormReturn } from "react-hook-form";

// export const orderDeleteCommissionAction = [
//     { action: "delete", title: "Delete Commission" },
//     { action: "keep", title: "Keep Commission" }
// ];
export default function SalesCommisionSettingSection({
    form
}: {
    form: UseFormReturn<ISalesSetting>;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Sales Commission</h3>
                <p className="text-sm text-muted-foreground">
                    Configure how sales commissions will work during sales.
                </p>
            </div>
            <Separator />
            <Form {...form}>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="meta.commission.percentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Commission Percentage (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        className=""
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </Form>
        </div>
    );
}
