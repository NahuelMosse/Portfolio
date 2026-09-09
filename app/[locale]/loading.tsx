export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-end bg-bg-deep">
      <div className="shell pb-[14vh]">
        <p className="mono text-fg-dim">
          <span className="text-accent">›</span> initializing runtime
        </p>
        <div className="mt-6 h-px w-full max-w-md bg-line">
          <div
            className="h-px w-1/3 bg-accent"
            style={{ animation: "rt-sweep 1.4s var(--ease-in-out) infinite" }}
          />
        </div>
      </div>
    </div>
  )
}
