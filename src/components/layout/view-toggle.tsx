"use client"

import * as React from "react"
import { Monitor, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ViewToggle() {
  const [isDesktop, setIsDesktop] = React.useState(true)

  const toggleView = () => {
    setIsDesktop(!isDesktop)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={toggleView}>
          {isDesktop ? (
            <Monitor className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Smartphone className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle View</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDesktop ? "Εναλλαγή σε προβολή κινητού" : "Εναλλαγή σε προβολή υπολογιστή"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
