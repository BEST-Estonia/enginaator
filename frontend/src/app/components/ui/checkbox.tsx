"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = {
  id?: string;
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
  boxClassName?: string;
  labelClassName?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      checked,
      defaultChecked,
      onCheckedChange,
      indeterminate = false,
      disabled = false,
      className,
      boxClassName,
      labelClassName,
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate && !checked;
      }
    }, [indeterminate, checked]);

    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-3 select-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <input
          id={id}
          ref={internalRef}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />

        {/* ruut */}
        <span
          aria-hidden="true"
          className={cn(
            "relative flex h-5 w-5 items-center justify-center rounded-md",
            "border border-gray-300 bg-white transition-all",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400",
            "peer-checked:border-transparent peer-checked:bg-[#ce1f22]",
            "peer-indeterminate:bg-[#ce1f22] peer-indeterminate:border-transparent",
            boxClassName
          )}
        >
          <svg
            className="pointer-events-none h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>

          <span className="absolute h-0.5 w-3.5 bg-white opacity-0 transition-opacity peer-indeterminate:opacity-100" />
        </span>

        {label ? (
          <span className={cn("text-sm text-gray-900", labelClassName)}>{label}</span>
        ) : null}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
