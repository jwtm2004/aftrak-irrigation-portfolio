import { identity } from "../../data";

export default function Footer() {
  return (
    <footer className="border-t border-edge py-12">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-mist">
            {identity.name}
          </p>
          <p className="mt-1 max-w-md text-sm text-fog">
            {identity.degree}, {identity.university}. Final-year individual
            project undertaken {identity.collaboration}; supervised by{" "}
            {identity.supervisor}.
          </p>
        </div>
        <ul className="flex gap-3">
          {[
            { label: "Email", href: identity.links.email },
            { label: "LinkedIn", href: identity.links.linkedin },
            { label: "GitHub", href: identity.links.github },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="chip-btn inline-block"
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap mt-8">
        <p className="font-mono text-xs text-fog/60">
          All performance figures are measured or derived values from the
          dissertation (three repeat lab tests per configuration). Site built
          with React, TypeScript, Tailwind, Framer Motion and Recharts.
        </p>
      </div>
    </footer>
  );
}
