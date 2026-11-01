"use client"

import { useId, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

// What, problem and role of a case. On a phone they open and close with a toggle; on wide screens they are always open.
export function CaseDetails({ defaultOpen, children }: { defaultOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  const body = useId()

  return (
    <div data-case-details="" data-open={open} className="case-details">
      <Button type="button" variant="ghost" className="case-toggle" aria-expanded={open} aria-controls={body} onClick={() => setOpen(!open)}>
        {open ? "Close the case" : "Open the case"}
      </Button>
      <div id={body} className="case-body">
        {children}
      </div>
    </div>
  )
}
