"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  children: React.ReactNode
  explanation: {
    title: string
    description: string
    formula?: string
    interpretation: string
    example?: string
  }
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

export function InfoTooltip({ 
  children, 
  explanation, 
  side = "top", 
  sideOffset = 8 
}: InfoTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "z-50 w-80 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg",
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">{explanation.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{explanation.description}</p>
              </div>
              {explanation.formula && (
                <div>
                  <h5 className="font-medium text-xs mb-1">Formula:</h5>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">{explanation.formula}</code>
                </div>
              )}
              <div>
                <h5 className="font-medium text-xs mb-1">Interpretasi:</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{explanation.interpretation}</p>
              </div>
              {explanation.example && (
                <div>
                  <h5 className="font-medium text-xs mb-1">Contoh:</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{explanation.example}</p>
                </div>
              )}
            </div>
            <TooltipPrimitive.Arrow className="fill-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}