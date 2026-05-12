import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      "block w-full resize-y rounded-none border border-border bg-ink-700 px-4 py-3 text-base text-bone-50 placeholder:text-bone-600 focus:border-ember focus:outline-none focus:ring-0",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
