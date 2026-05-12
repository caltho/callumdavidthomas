import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "block w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-base text-bone-50 placeholder:text-bone-600 focus:border-ember focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
