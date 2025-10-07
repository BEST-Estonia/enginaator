// components/ui/size-select.tsx
"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export type ShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
const SIZES: ShirtSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

type SizeSelectProps = {
  id?: string;
  label?: React.ReactNode;
  value?: ShirtSize;
  defaultValue?: ShirtSize;
  onChange?: (size: ShirtSize) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;         // wrapperi klass (nagu Inputi div)
  triggerClassName?: string;  // SelectTriggeri lisa-klass
};

export function SizeSelect({
  id,
  label = "Särgi suurus",
  value,
  defaultValue,
  onChange,
  placeholder = "Vali suurus",
  disabled,
  required,
  className,
  triggerClassName,
}: SizeSelectProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label ? (
        <Label htmlFor={id}>
          {label} {required ? "*" : null}
        </Label>
      ) : null}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onChange?.(v as ShirtSize)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            // ⬇️ match shadcn Input defaults
            "mt-2 h-10 w-full rounded-md border border-gray-300 bg-white",
            "px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--enginaator-red))] focus:ring-offset-0",
            // kui kasutad ka Inputil custom focus-border klassi, hoia sama vibe:
            "focus:border-[hsl(var(--enginaator-red))]",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          className="z-[999] bg-white border border-gray-200"
          sideOffset={5}
          align="center"
          avoidCollisions
        >
          {SIZES.map((s) => (
            <SelectItem
              key={s}
              value={s}
              className="text-sm h-9 py-2 focus:bg-red-100 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
            >
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
