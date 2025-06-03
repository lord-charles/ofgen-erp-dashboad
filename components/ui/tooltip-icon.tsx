import type React from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipIconProps {
  content: React.ReactNode
  className?: string
}

export function TooltipIcon({ content, className }: TooltipIconProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 text-muted-foreground cursor-help ${className || ""}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] text-sm">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
