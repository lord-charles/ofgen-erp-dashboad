import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipIcon } from "./tooltip-icon";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  tooltip?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  tooltip,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <TooltipProvider>
      <div className={cn("grid gap-2", className)}>
        <div className="flex items-center gap-2">
          <Label htmlFor={htmlFor} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          {tooltip && <TooltipIcon content={tooltip} />}
        </div>
        {children}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </TooltipProvider>
  );
}
