// The phone's call to action: a fixed bar under the thumb. It exists in the page at every width and shows on phones.
export function HireBar({ label, href }: { label: string; href: string }) {
  return (
    <div data-hire-bar="" className="hire-bar">
      <a href={href}>{label}</a>
    </div>
  )
}
