"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Locale, PortfolioContent } from "@/lib/content/types"
import { localePath, otherLocale } from "@/lib/content"
import { scrollToElement } from "@/lib/scroll"

interface Command {
  id: string
  label: string
  group: "navigate" | "actions"
  hint?: string
  run: () => void
}

/**
 * ⌘K palette.
 *
 * Navigation for a page this long should not require scrolling to find the
 * scroll target. It doubles as the keyboard path to every action on the site,
 * which is also how the language switch and CV download stay out of the
 * visual design.
 */
export function CommandPalette({
  content,
  locale,
}: {
  content: PortfolioContent
  locale: Locale
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const copy = content.ui.commandPalette

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
  }, [])

  // Focus is restored after the dialog unmounts, not inside the close handler:
  // moving focus while the overlay is still on screen puts it on an element
  // that is about to disappear.
  useEffect(() => {
    if (open) return
    const previous = restoreFocus.current
    if (!previous) return
    restoreFocus.current = null
    previous.focus()
  }, [open])

  const commands = useMemo<Command[]>(() => {
    const navigate: Command[] = content.ui.sections.map((section) => ({
      id: `go-${section.id}`,
      label: section.label,
      group: "navigate",
      run: () => scrollToElement(section.id),
    }))

    const actions: Command[] = [
      {
        id: "locale",
        label: copy.switchLocale,
        group: "actions",
        hint: content.ui.localeLabel,
        run: () => {
          window.location.href = localePath(otherLocale(locale))
        },
      },
      {
        id: "email",
        label: content.contact.primary.label,
        group: "actions",
        run: () => {
          window.location.href = content.contact.primary.href
        },
      },
      ...content.identity.links.map((link) => ({
        id: `link-${link.label}`,
        label: link.label,
        group: "actions" as const,
        hint: "↗",
        run: () => window.open(link.href, "_blank", "noopener,noreferrer"),
      })),
    ]

    return [...navigate, ...actions]
  }, [content, copy, locale])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  // Keep the cursor inside the result set as it shrinks.
  useEffect(() => setCursor(0), [query])

  /* ---- Global shortcut ------------------------------------------------- */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isPaletteKey =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"

      if (isPaletteKey) {
        event.preventDefault()
        restoreFocus.current = document.activeElement as HTMLElement
        setOpen((v) => !v)
        return
      }

      if (event.key === "Escape" && open) {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    // Focus after paint so the browser doesn't scroll the page to reach it.
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setCursor((c) =>
        results.length ? (c - 1 + results.length) % results.length : 0,
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      const command = results[cursor]
      if (command) {
        close()
        // Let the overlay unmount before scrolling, or the smooth scroll is
        // interrupted by the focus restore.
        requestAnimationFrame(command.run)
      }
    }
  }

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" })
  }, [cursor])

  if (!open) return <Trigger label={copy.open} onOpen={() => setOpen(true)} />

  const groups: Array<Command["group"]> = ["navigate", "actions"]

  return (
    <>
      <Trigger label={copy.open} onOpen={() => setOpen(true)} />

      <div
        className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
        role="dialog"
        aria-modal="true"
        aria-label={copy.open}
      >
        <button
          type="button"
          aria-label={copy.close}
          onClick={close}
          className="absolute inset-0 cursor-default bg-bg-deep/80 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-xl border border-line bg-surface shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 border-b border-line-soft px-4">
            <span className="mono text-accent" aria-hidden>
              ›
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              className="w-full bg-transparent py-4 font-mono text-sm text-fg outline-none placeholder:text-fg-faint"
            />
            <kbd className="mono shrink-0 border border-line-soft px-1.5 py-0.5 text-fg-faint">
              esc
            </kbd>
          </div>

          <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
            {results.length === 0 ? (
              <li className="mono px-4 py-6 text-center text-fg-faint">
                {copy.empty}
              </li>
            ) : (
              groups.map((group) => {
                const inGroup = results.filter((c) => c.group === group)
                if (!inGroup.length) return null

                return (
                  <li key={group}>
                    <p className="mono px-4 pb-1 pt-3 text-fg-faint">
                      {copy.groups[group]}
                    </p>
                    <ul>
                      {inGroup.map((command) => {
                        const index = results.indexOf(command)
                        const active = index === cursor
                        return (
                          <li key={command.id}>
                            <button
                              type="button"
                              data-active={active}
                              onMouseEnter={() => setCursor(index)}
                              onClick={() => {
                                close()
                                requestAnimationFrame(command.run)
                              }}
                              className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm transition-colors ${
                                active
                                  ? "bg-accent text-accent-ink"
                                  : "text-fg-dim hover:text-fg"
                              }`}
                            >
                              <span>{command.label}</span>
                              {command.hint ? (
                                <span className="mono opacity-70">
                                  {command.hint}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */

/** Visible affordance — a shortcut nobody can discover is a shortcut nobody uses. */
function Trigger({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mono group flex items-center gap-2 border border-line-soft px-3 py-2 text-fg-dim transition-colors hover:border-accent hover:text-accent"
    >
      {label}
      <kbd className="border border-line-soft px-1 text-fg-faint transition-colors group-hover:border-accent/60">
        ⌘K
      </kbd>
    </button>
  )
}
