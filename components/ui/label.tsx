import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";
