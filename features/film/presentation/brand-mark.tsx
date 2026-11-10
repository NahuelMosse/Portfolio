export const STAMP_ID = "n5-stamp"
export const STAMP_VIEWBOX = "0 0 1180 815"

// The logo slot: the n5 stamp, in the top bar and in the opening title. It draws the stamp the page carries once (StampSprite)
// in the color of where it sits, as one block 1em high, so the title's ink and its flight to the top bar work on the same art.
// The name stays as text for the link and for whoever reads the page without images.
export function BrandMark({ filter }: { filter?: string }) {
  return (
    <span data-brand-mark="" className="brand-mark">
      <svg viewBox={STAMP_VIEWBOX} aria-hidden="true" focusable="false">
        <use href={`#${STAMP_ID}`} filter={filter} />
      </svg>
      <span className="sr-only">NAWI</span>
    </span>
  )
}
