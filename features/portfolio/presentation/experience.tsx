import { Chapter } from "@/features/film/presentation/chapter"
import { experience } from "./content"

export function Experience() {
  return (
    <Chapter id="experience" label="Experience" tone="dark" nextTone="dark" title={<>Where I <em>served</em></>}>
      {experience.map((employer) => (
        <article key={employer.id} data-employer={employer.id} data-current={employer.current === true} className="employer story">
          <div>
            <h3>{employer.name}</h3>
            <span className="period">{employer.period}</span>
          </div>
          <div>
            <p data-field="what">{employer.what}</p>
            <p data-field="problem">{employer.problem}</p>
            <p data-field="role">{employer.role}</p>
          </div>
        </article>
      ))}
    </Chapter>
  )
}
