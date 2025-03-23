import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { FacetedFilterItem } from "@/components/ui/faceted-filter";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

export const comboBoxVariants = cva("", {
    variants: {
        container: {},
    },
});
interface Props<T> {
    label?;
    options?: (T | { label: string; value: string })[];
    labelKey?: keyof (T & { label: string; value: string });
    valueKey?: keyof (T & { label: string; value: string });
    className?: string;
    maxSelection?;
    placeholder?: string;
    maxStack?;
}

export function ComboxBox<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TOptionType = any
>({
    valueKey = "value",
    label,
    labelKey = "label",
    className,
    maxSelection = 1,
    placeholder,
    maxStack = 2,
    ...props
}: Partial<ControllerProps<TFieldValues, TName>> & Props<TOptionType>) {
    const filterFields = props.options;

    const optValue = (opt) => opt?.[valueKey];
    const optLabel = (opt) => opt?.[labelKey];
    const [open, onOpenChange] = useState(false);
    return (
        <FormField
            {...(props as any)}
            render={({ field }) => {
                const selectedValues = new Set(
                    Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : []
                );
                const onSelect = (value) => {
                    if (maxSelection > 1) {
                        const currentValue = [...selectedValues];
                        const newValue = currentValue.includes(value)
                            ? currentValue.filter((v) => v !== value)
                            : [...currentValue, value];
                        field.onChange(newValue);
                        return;
                    }
                    const filterField = filterFields.find(
                        (col) => optValue(col) === value
                    );

                    if (!filterField) return;

                    field.onChange(optValue(filterField));
                    onOpenChange(false);
                };
                return (
                    <FormItem className={cn("mx-1")}>
                        {label && <FormLabel>{label}</FormLabel>}
                        <Popover modal open={open} onOpenChange={onOpenChange}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <div
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                            }),
                                            "h-8 w-32 justify-between gap-4 flex rounded focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 items-center",
                                            className
                                        )}
                                        aria-label="Select filter field"
                                    >
                                        {selectedValues?.size == 0 ||
                                        maxSelection == 1 ? (
                                            <>
                                                <span className="truncate">
                                                    {optLabel(
                                                        filterFields.find(
                                                            (opt) =>
                                                                optValue(
                                                                    opt
                                                                ) ===
                                                                field.value
                                                        )
                                                    ) || "Select field"}
                                                </span>
                                                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                                            </>
                                        ) : (
                                            <>
                                                {selectedValues?.size > 0 && (
                                                    <div className="flex items-center">
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-sm px-1 font-normal lg:hidden"
                                                        >
                                                            {
                                                                selectedValues.size
                                                            }
                                                        </Badge>
                                                        <div className="hidden min-w-0 gap-1 lg:flex">
                                                            {selectedValues.size >
                                                            maxStack ? (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="rounded-sm px-1 font-normal"
                                                                >
                                                                    {
                                                                        selectedValues.size
                                                                    }{" "}
                                                                    selected
                                                                </Badge>
                                                            ) : (
                                                                filterFields
                                                                    ?.filter(
                                                                        (
                                                                            option
                                                                        ) =>
                                                                            selectedValues.has(
                                                                                optValue(
                                                                                    option
                                                                                )
                                                                            )
                                                                    )
                                                                    .map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                key={optValue(
                                                                                    option
                                                                                )}
                                                                                className="truncate rounded-sm px-1 font-normal"
                                                                            >
                                                                                {optLabel(
                                                                                    option
                                                                                )}
                                                                            </Badge>
                                                                        )
                                                                    )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className={cn("min-w-40 p-0")}
                            >
                                <Command>
                                    <CommandInput
                                        placeholder="Search fields..."
                                        className={cn("")}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No fields found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {filterFields.map((opt) =>
                                                maxSelection > 1 ? (
                                                    <FacetedFilterItem
                                                        key={optValue(opt)}
                                                        value={optValue(opt)}
                                                        onSelect={onSelect}
                                                        selected={selectedValues.has(
                                                            optValue(opt)
                                                        )}
                                                    >
                                                        {/* {opt?.icon && (
                                                            <opt.icon
                                                                className="mr-2 size-4 text-muted-foreground"
                                                                aria-hidden="true"
                                                            />
                                                        )} */}
                                                        <span>
                                                            {optLabel(opt)}
                                                        </span>
                                                        {(opt as any).count && (
                                                            <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                                                {
                                                                    (opt as any)
                                                                        .count
                                                                }
                                                            </span>
                                                        )}
                                                    </FacetedFilterItem>
                                                ) : (
                                                    <CommandItem
                                                        key={optValue(opt)}
                                                        value={optValue(opt)}
                                                        onSelect={onSelect}
                                                    >
                                                        <span className="mr-1.5 truncate">
                                                            {optLabel(opt)}
                                                        </span>
                                                        <Check
                                                            className={cn(
                                                                "ml-auto size-4 shrink-0",
                                                                optValue(
                                                                    opt
                                                                ) ===
                                                                    field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                );
            }}
        />
    );
}
