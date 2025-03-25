"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input, InputProps } from "./ui/input";

export function LabelInput({ className, ...props }: InputProps) {
  //   const { setValue, watch } = useFormContext();
  //   const value = watch(name);

  const [isFocused, setIsFocused] = useState(false);
  const isPlaceholder = !props.value && !isFocused;
  return (
    <div className="relative">
      <Input
        {...props}
        {...props}
        // ref={ref}
        autoComplete="off"
        value={props.value || ""}
        className={cn(
          "border-0 p-0 h-6 border-b border-transparent focus:border-border font-mono text-xs",
          isPlaceholder && "opacity-0",
          className,
        )}
        onFocus={(evt) => {
          setIsFocused(true);
          props.onFocus?.(evt);
        }}
        onBlur={(evt) => {
          setIsFocused(false);
          props.onBlur?.(evt);
        }}
      />
      {isPlaceholder && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
        </div>
      )}
    </div>
  );
}
