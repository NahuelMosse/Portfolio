type SeamFigureProps = {
  side: "left" | "right"
  // the chapter this figure leads into
  toward: string
}

// A veiled figure that stands on the seam between two chapters: half of it in the chapter above, half in the one below.
// The right-hand figure is mirrored so both look inward, toward the chapter that follows.
export function SeamFigure({ side, toward }: SeamFigureProps) {
  return (
    <svg
      data-seam-figure=""
      data-side={side}
      data-toward={toward}
      className="seam-figure"
      viewBox="0 0 120 160"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M20 160V92C20 62 36 42 60 36C84 42 100 62 100 92V160M60 36V12M60 0L63 10L74 12L63 14L60 24L57 14L46 12L57 10Z"
      />
      <path fill="currentColor" d="M40 100C40 84 50 74 60 74C70 74 80 84 80 100C70 94 50 94 40 100Z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M100 100L118 118" />
    </svg>
  )
}
