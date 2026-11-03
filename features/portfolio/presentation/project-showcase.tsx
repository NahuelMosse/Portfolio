const numeral = (position: number) => String(position).padStart(2, "0")

type TabsProps = { label: string; names: readonly string[]; current: number }

// The strip of the dev kit's scene: its kind and the project in it.
export function ProjectTabs({ label, names, current }: TabsProps) {
  return (
    <ol className="show-index" aria-label={`${label} projects`}>
      <li className="show-kind" aria-hidden="true">
        {label}
      </li>
      {names.map((name, order) => (
        <li key={name} aria-current={order === current ? "step" : undefined}>
          <button type="button" aria-pressed={order === current}>
            <b>{numeral(order + 1)}</b>
            <span>{name}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}
