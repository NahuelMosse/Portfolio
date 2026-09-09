"use client"

import type { PortfolioContent } from "@/lib/content/types"
import { ActionButton, Link } from "@/components/ui/primitives"
import { useCopy, useZonedTime } from "@/hooks/use-runtime"

export function Contact({ content }: { content: PortfolioContent }) {
  const { contact, identity } = content
  const time = useZonedTime(identity.timezone)
  const { copied, copy } = useCopy()

  return (
    <section
      id="contact"
      className="relative border-t border-line-soft/60 py-24 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="reticle absolute inset-0 opacity-[0.25]"
        style={{
          maskImage:
            "radial-gradient(100% 80% at 50% 40%, black 10%, transparent 78%)",
        }}
      />

      <div className="shell relative">
        <span className="mono text-accent" data-reveal>
          {contact.eyebrow}
        </span>

        <h2
          className="display-2 mt-5 max-w-[16ch] font-[family-name:var(--font-display)] font-extrabold leading-[0.9] tracking-[-0.03em] text-fg"
          data-reveal
        >
          {contact.title}
        </h2>

        <p className="mt-8 max-w-[54ch] text-lg text-fg-dim" data-reveal>
          {contact.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal>
          <ActionButton href={contact.primary.href}>{contact.primary.label}</ActionButton>
          <button
            type="button"
            onClick={() => copy(identity.email)}
            className="mono border border-line-soft px-6 py-3.5 text-fg-dim transition-colors duration-200 hover:border-accent/70 hover:text-fg"
          >
            <span aria-live="polite" className={copied ? "text-accent" : undefined}>
              {copied ? contact.copiedLabel : contact.copyLabel}
            </span>
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          <div className="mono">
            <span className="block text-fg-faint">{contact.localTimeLabel}</span>
            <span className="mt-1 block tnum text-fg" suppressHydrationWarning>
              {time || "--:--"}
            </span>
          </div>
          <div className="mono">
            <span className="block text-fg-faint">{identity.location}</span>
          </div>
          <div className="mono">
            <span className="block text-fg-faint">{identity.availability}</span>
          </div>
          <div className="mono flex flex-col gap-1">
            {identity.links.map((link) => (
              <Link key={link.href} href={link.href} external className="text-fg">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ content }: { content: PortfolioContent }) {
  const { footer } = content

  return (
    <footer className="border-t border-line-soft/60 py-8">
      <div className="shell">
        <div className="mono flex flex-wrap items-center justify-between gap-4 text-fg-faint">
          <span>
            {footer.builtWith} {footer.stack}
          </span>
          <Link href="https://github.com/NahuelMosse/Portfolio" external>
            {footer.repo}
          </Link>
        </div>
        <p className="mono mt-4 text-fg-faint opacity-70">{footer.note}</p>
      </div>
    </footer>
  )
}
