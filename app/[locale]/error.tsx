"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error)
    }
  }, [error])

  return (
    <main className="flex min-h-[100svh] items-center bg-bg">
      <div className="shell">
        <p className="mono text-accent">error</p>
        <h1 className="mt-4 max-w-[16ch] text-3xl">Something stopped running.</h1>
        <p className="mt-4 max-w-[52ch] text-lg text-fg-dim">
          The page hit an unexpected state. Reloading usually clears it.
        </p>

        {error.digest ? (
          <p className="mono mt-6 text-fg-faint">digest {error.digest}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="mono border border-accent bg-accent px-5 py-3 text-accent-ink transition-colors hover:bg-transparent hover:text-accent"
          >
            Retry
          </button>
          <Link
            href="/"
            className="mono border border-line-soft px-5 py-3 text-fg-dim transition-colors hover:border-accent hover:text-accent"
          >
            Back to start
          </Link>
        </div>
      </div>
    </main>
  )
}
