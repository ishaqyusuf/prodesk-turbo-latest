import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Input } from "./ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CurrencyInput({
    thousandSeparator = true,
    ...props
}: NumericFormatProps) {
    return (
        <NumericFormat
            thousandSeparator={thousandSeparator}
            customInput={Input}
            {...props}
        />
    );
}

export function NumberInput({
    thousandSeparator = true,
    value,
    className,
    // onValueChange,
    ...props
}: NumericFormatProps) {
    // props.value
    const [isFocused, setIsFocused] = useState(false);
    const isPlaceholder = !value && !isFocused;
    return (
        <div className="relative  font-mono midday">
            <CurrencyInput
                // suffix="%)"
                // prefix="$"
                autoComplete="off"
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    // onBlur();
                }}
                // className="p-0 border-0 h-6 text-xs !bg-transparent font-mono flex-shrink-0 w-16 text-[11px] text-[#878787]"
                thousandSeparator={true}
                decimalScale={2}
                // isAllowed={(values) => {
                //     const { floatValue } = values;
                //     return (
                //         floatValue === undefined ||
                //         (floatValue >= 0 && floatValue <= 100)
                //     );
                // }}
                className={cn(
                    // className,
                    isPlaceholder && "opacity-0",
                    "p-0 border-0 h-6 text-xs !bg-transparent border-b border-transparents focus:border-border",
                    className
                )}
                allowNegative={false}
                {...props}
            />
            {isPlaceholder && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
                </div>
            )}
        </div>
    );
}
