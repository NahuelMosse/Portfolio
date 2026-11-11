import { identity } from "./content"

const pathOf = (href: string) => new URL(href).pathname.slice(1)

// The two networks the contact block links to; the handle is what comes after the host.
export const linkedin = { id: "linkedin", label: "LinkedIn", href: identity.linkedin, handle: pathOf(identity.linkedin), host: "linkedin.com" } as const
export const github = { id: "github", label: "GitHub", href: identity.github, handle: pathOf(identity.github), host: "github.com" } as const
