import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Section shell                                                               */
/* -------------------------------------------------------------------------- */

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
  /** Renders beside the title — a filter row, a counter, a control. */
  aside?: ReactNode
  /** Section fills the viewport; used by the pinned rail. */
  full?: boolean
}

/**
 * Every section opens the same way: a monospace index, a display title, and an
 * optional lede. Consistency here is what lets each section's *content* be the
 * thing that surprises.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  aside,
  full,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t border-line-soft/60 py-20 md:py-28",
        full && "min-h-[100svh]",
        className,
      )}
    >
      <div className="shell">
        <SectionHead eyebrow={eyebrow} title={title} intro={intro} aside={aside} />
        {children}
      </div>
    </section>
  )
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string
  title: string
  intro?: string
  aside?: ReactNode
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4">
        <span className="mono text-accent" data-reveal>
          {eyebrow}
        </span>
        <span aria-hidden className="h-px flex-1" data-reveal="wipe">
          <span className="block h-px bg-line-soft" />
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2
          className="max-w-[18ch] text-3xl md:text-4xl"
          data-reveal
          style={delay(80)}
        >
          {title}
        </h2>
        {aside}
      </div>

      {intro ? (
        <p
          className="mt-6 max-w-[62ch] text-lg leading-relaxed text-fg-dim"
          data-reveal
          style={delay(160)}
        >
          {intro}
        </p>
      ) : null}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The base surface. Square corners, hairline border, and a hover state that
 * lifts the border to the accent rather than adding a shadow — this palette
 * has no light source to justify one.
 */
export function Panel({
  children,
  className,
  interactive,
  ...rest
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative border border-line-soft bg-surface/60 backdrop-blur-[2px]",
        interactive &&
          "transition-colors duration-200 hover:border-accent/70 hover:bg-surface",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Monospace key/value row — the readout pattern used across the page. */
export function Readout({
  label,
  value,
  className,
}: {
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4", className)}>
      <span className="mono text-fg-faint">{label}</span>
      <span className="mono tnum text-fg">{value}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Bits                                                                        */
/* -------------------------------------------------------------------------- */

export function Tags({ items, max }: { items: string[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items
  const rest = max ? items.length - shown.length : 0

  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <li
          key={item}
          className="mono border border-line-soft px-2 py-1 text-fg-dim"
        >
          {item}
        </li>
      ))}
      {rest > 0 ? (
        <li className="mono border border-line-soft/50 px-2 py-1 text-fg-faint">
          +{rest}
        </li>
      ) : null}
    </ul>
  )
}

/** Text link with an underline that draws in on hover. */
export function Link({
  href,
  children,
  external,
  className,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        // Padding + negative margin grows the hit area to WCAG's 24px minimum
        // without shifting surrounding layout.
        "group relative -my-2 inline-flex items-center gap-1.5 py-2 text-fg transition-colors hover:text-accent",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </span>
      {external ? (
        <span aria-hidden className="text-xs opacity-60">
          ↗
        </span>
      ) : null}
    </a>
  )
}

/** Primary call to action. Solid accent block, inverted text. */
export function ActionButton({
  href,
  children,
  onClick,
  className,
}: {
  href?: string
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  const classes = cn(
    "group relative inline-flex items-center gap-3 overflow-hidden border border-accent bg-accent px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-[0.14em] text-accent-ink transition-colors duration-200 hover:bg-transparent hover:text-accent",
    className,
  )

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}

/** Stagger helper — keeps the reveal delays declarative at call sites. */
export function delay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties
}
