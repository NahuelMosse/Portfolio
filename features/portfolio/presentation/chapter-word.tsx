type ChapterWordProps = {
  id: "projects" | "experience" | "offer" | "contact"
  heading: "h2" | "h3"
  // the chapter's number in the file and a short catalog line, set in fine type around the word
  numeral: string
  note: string
  headingId?: string
  children: string
}

// Words longer than this are sized down to stay inside the viewport.
const LONG_WORD_LETTERS = 8

// A chapter word at poster scale with its fine detail: numeral, a thin rule, a catalog line and a four-point star.
// Each chapter composes it differently in CSS (flush side, drop or rise across the edge of its illustration).
export function ChapterWord({ id, heading: Heading, numeral, note, headingId, children }: ChapterWordProps) {
  const long = children.length > LONG_WORD_LETTERS
  return (
    <div data-chapter-title={id} className="chapter-title">
      <p className="chapter-detail" aria-hidden="true">
        <span>{numeral}</span>
        <i />
        <span>{note}</span>
        <b />
      </p>
      <Heading id={headingId} tabIndex={-1} data-chapter-word={id} data-long={long ? "" : undefined} className="chapter-word">
        {children}
      </Heading>
    </div>
  )
}
