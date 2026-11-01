"use client"

import { useId, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

// Problem and My role of a case: closed until the visitor opens them.
export function CaseDetails({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const body = useId()

  return (
    <div data-case-details="" data-open={open} className="case-details">
      <Button type="button" variant="ghost" className="case-toggle" aria-expanded={open} aria-controls={body} onClick={() => setOpen(!open)}>
        {open ? "Hide problem and role" : "Problem and my role"}
      </Button>
      <div id={body} className="case-body">
        {children}
      </div>
    </div>
  )
}
