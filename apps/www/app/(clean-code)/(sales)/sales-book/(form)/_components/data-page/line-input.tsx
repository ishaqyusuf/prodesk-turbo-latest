import { Input as BaseInput, InputProps } from "@/components/ui/input";
import {
    Select as BaseSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldPath, FieldPathValue } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useFormDataStore } from "../../_common/_stores/form-data-store";
import { SalesFormZusData } from "@/app/(clean-code)/(sales)/types";
import { dotObject } from "@/app/(clean-code)/_common/utils/utils";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormSelectProps } from "@/components/common/controls/form-select";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { LabelInput } from "@/components/label-input";
import { NumberInput } from "@/components/currency-input";

interface LineInputProps {
    name: FieldPath<SalesFormZusData>;
    label?: string;
    onChange?;
    midday?: boolean;
    currency?: boolean;
}
function getValue<K extends FieldPath<SalesFormZusData>>(
    path: K,
    state: SalesFormZusData
): FieldPathValue<SalesFormZusData, K> {
    return dotObject.pick(path, state);
}
export function Input({
    name,
    label,
    onChange,
    midday,
    currency,
    ...props
}: LineInputProps & InputProps) {
    const state = useFormDataStore();

    const value = useMemo(() => {
        const value = getValue(name, state);
        return value || "";
    }, [state]);

    return (
        <div
            className={cn(
                label && "grid gap-2",
                midday && "grid-cols-2 flex items-center   space-x-2 uppercase"
            )}
        >
            {label && (
                <Label
                    className={cn(
                        props.disabled && "text-muted-foreground",
                        midday && "text-xss font-mono"
                    )}
                >
                    {label}:
                </Label>
            )}
            {midday ? (
                <>
                    {currency ? (
                        <NumberInput
                            prefix="$"
                            className="w-16"
                            value={value as any}
                            onValueChange={(e) => {
                                console.log(e);

                                const val = e.floatValue || null;
                                state.dotUpdate(name, val);
                                onChange?.(val);
                            }}
                        />
                    ) : (
                        <LabelInput
                            className="w-28 midday"
                            value={value as any}
                            onChange={(e) => {
                                const val =
                                    props.type == "number"
                                        ? +e.target.value
                                        : e.target.value;
                                state.dotUpdate(name, val);
                                onChange?.(val);
                            }}
                        />
                    )}
                </>
            ) : (
                <BaseInput
                    {...props}
                    className={cn("h-8", props.className)}
                    value={value as any}
                    onChange={(e) => {
                        const val =
                            props.type == "number"
                                ? +e.target.value
                                : e.target.value;
                        state.dotUpdate(name, val);
                        onChange?.(val);
                    }}
                />
            )}
        </div>
    );
}
export function Select<T>({
    name,
    options,
    valueKey,
    titleKey,
    Item,
    SelectItem: SelItem,
    label,
    midday,
    ...props
}: LineInputProps & FormSelectProps<T>) {
    const state = useFormDataStore();
    const value = getValue(name, state);
    function itemValue(option) {
        if (!option) return option;
        if (Number.isInteger(option)) option = String(option);

        return typeof option == "object" ? option[valueKey] : option;
    }
    function itemText(option) {
        if (!option) return option;
        return typeof option == "string"
            ? option
            : titleKey == "label"
            ? option[titleKey] || option["text"]
            : option[titleKey];
    }
    const isPlaceholder = !value;
    return (
        <div
            className={cn(
                label && "grid gap-2",
                midday && "flex items-center  uppercase"
            )}
        >
            {label && (
                <Label
                    className={cn(
                        midday && "text-xss font-mono whitespace-nowrap "
                    )}
                >
                    {label}:
                </Label>
            )}
            <BaseSelect
                onValueChange={(e) => {
                    state.dotUpdate(name, e);
                    props.onSelect?.(e as any);
                }}
                value={value}
            >
                {midday ? (
                    <SelectTrigger
                        noIcon
                        className="border-none p-0 bg-transparent  relative font-mono uppercases w-auto min-w-[16px] midday h-7"
                    >
                        {isPlaceholder && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
                            </div>
                        )}

                        <SelectValue
                            asChild
                            className="whitespace-nowrap uppercase font-mono border-none p-0"
                            // placeholder={props.placeholder}
                        >
                            <span>
                                {itemText(
                                    options?.find((o) => itemValue(o) == value)
                                )}
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                ) : (
                    <SelectTrigger className={cn("h-8")}>
                        <div className="inline-flex gap-1">
                            <SelectValue
                                className="whitespace-nowrap"
                                placeholder={props.placeholder}
                            ></SelectValue>
                        </div>
                    </SelectTrigger>
                )}
                <SelectContent className="">
                    <ScrollArea className="max-h-[40vh] overflow-auto">
                        {options?.map((option, index) =>
                            SelItem ? (
                                <SelItem option={option} key={index} />
                            ) : (
                                <SelectItem
                                    key={index}
                                    value={itemValue(option)}
                                >
                                    {Item ? (
                                        <Item option={option} />
                                    ) : (
                                        <>{itemText(option)}</>
                                    )}
                                </SelectItem>
                            )
                        )}
                    </ScrollArea>
                </SelectContent>
            </BaseSelect>
        </div>
    );
}
export function LineSwitch({ name }: LineInputProps) {
    const state = useFormDataStore();
    const value = getValue(name, state);

    return (
        <>
            <Switch
                defaultChecked={value as any}
                onCheckedChange={(e) => {
                    state.dotUpdate(name, e);
                }}
            />
        </>
    );
}
