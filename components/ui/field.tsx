import type { ReactNode } from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

/**
 * Stacked label + input wrapper used throughout the admin forms.
 */
export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint && (
          <span className="font-mono text-[10px] tracking-wide text-bone-600">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
