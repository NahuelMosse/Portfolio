// What the three tools printed when they were run for this page, trimmed to what fits a window. A line starts with its role:
// "$ " a command, "!! " an error, "~ " a warning, "# " a note; anything else is plain output. A "…" ends a line that was cut.
// The runs: motion-audit and http-attack against throwaway pages and servers on 127.0.0.1 written for the run, migrations-safe
// against a three-file sample folder and a SQLite database of 120 rows.

export type TerminalScreen = { caption: string; lines: readonly string[] }

export const motionAuditScreens: readonly TerminalScreen[] = [
  {
    caption: "Install",
    lines: [
      "$ npm i -D motion-audit playwright",
      "added 5 packages, and audited 6 packages in 8s",
      "found 0 vulnerabilities",
      "$ npx playwright install chromium",
      "$ npx motion-audit --help",
      "motion-audit <url|file> [options]",
      "motion-audit compare <ref.json> <mine.json>",
      "  --only <selector>  audit only elements matching it",
      "  --max <n>          audit at most n controls",
      "  --cpu <rate>       throttle the CPU (4 is a phone)",
      "  --interact         also press and toggle controls …",
    ],
  },
  {
    caption: "A page audited",
    lines: [
      "$ npx motion-audit http://127.0.0.1:38417",
      "audited 5 of 5 controls · mode observe-only",
      "respond on hover 4 · press 0 · focus 5 …",
      "~ no-press-feedback: button “Filters”:",
      "~   press: nothing visible changes",
      "~ snaps: button “Export”: hover:",
      "~   background-color change with no transition",
      "~ no-press-feedback: button “Export”",
      "!! no-feedback: button “Refresh”: hover:",
      "!!   nothing visible changes",
    ],
  },
  {
    caption: "What moves badly",
    lines: [
      "~ duration: a “Order A”: hover:",
      "~   box-shadow 400 ms, outside 80-300 ms",
      "!! ease-in: a “Order A”: hover:",
      "!!   box-shadow eases in (ease-in):",
      "!!   the response starts late",
      "~ ungated-hover: button.lift:hover: moves on",
      "~   :hover outside @media (hover: hover) …",
      "~ reduced-motion-missing: stylesheets: elements",
      "~   move but no stylesheet has a …",
      "3 to fix, or suppress in the config with a reason",
      "exit 1",
    ],
  },
  {
    caption: "Options",
    lines: [
      "$ npx motion-audit --help",
      "  --click <selector>  record 1.5 s after a real click",
      "  --interrupt         with --click: click again half-way",
      "  --frames <selector> write a contact sheet of its",
      "                      hover and press",
      "  --baseline <report> ignore findings already present",
      "  --min-coverage <0-1> exit 2 when audited/candidates",
      "                      is lower",
      "  --strict            warnings fail too",
      "  --json              print the report as JSON",
    ],
  },
]

export const httpAttackScreens: readonly TerminalScreen[] = [
  {
    caption: "Install",
    lines: [
      "$ npm i -D http-attack",
      "$ npx http-attack --help",
      "http-attack: adversarial probes against an HTTP API",
      "running on this machine.",
      "usage: node http-attack.mjs <base-url> [options]",
      "Routes",
      "  --write \"<METHOD> <path> <body>\"",
      "         a request that creates or changes state …",
      "  --read \"<path>\"",
      "         a request that returns data …",
      "  --search \"<path> <param>\"",
    ],
  },
  {
    caption: "A server probed",
    lines: [
      "# a throwaway server on 127.0.0.1, written for this run",
      "$ npx http-attack http://127.0.0.1:27311 \\",
      "    --write 'POST /items {\"name\":\"Ana\",…}' \\",
      "    --read \"/items?limit=10\"",
      "pass          201   [auth] POST /items legitimate request",
      "NOT RUN       -     [auth] authentication probes",
      "!! FAIL critical ECONNRESET [input]",
      "!!   POST /items malformed JSON",
      "     expected: 400 with the error body",
      "     evidence: the app stopped answering",
    ],
  },
  {
    caption: "What it found",
    lines: [
      "!! FAIL critical [input] POST /items",
      "!!   without a Content-Type",
      "     expected: 415 (never a 5xx from reading",
      "     a missing header)",
      "!! FAIL critical [input] POST /items",
      "!!   “name” sent as a number",
      "     expected: 400/422: wrong type, never coerced,",
      "     never a 5xx",
      "!! FAIL critical [resources] POST /items",
      "!!   body that never ends (chunked)",
      "     expected: 413 once over the limit, or 408 …",
    ],
  },
  {
    caption: "The verdict",
    lines: [
      "47 probes run - 46 findings (critical 46, high 0,",
      "medium 0, low 0) - 0 suppressed - 2 not run",
      "exit 1",
      "# 0 no findings · 1 findings · 2 the run could not",
      "# complete",
      "# a finding id never holds generated values:",
      "id: process-died:malformed-json:POST /items",
    ],
  },
]

export const migrationsSafeScreens: readonly TerminalScreen[] = [
  {
    caption: "Install",
    lines: [
      "$ npm i -D migrations-safe",
      "$ npx migrations-safe --help",
      "usage: migrations-safe <command> [arguments]",
      "  lint      static checks over SQL migrations",
      "            and their git history",
      "  rehearse  apply migrations to a copy of a SQLite",
      "            database or to a throwaway Docker …",
      "Exit codes: 0 nothing at the failure level,",
      "1 findings, 2 could not run (never a pass).",
    ],
  },
  {
    caption: "Linted",
    lines: [
      "$ npx migrations-safe lint db/migrations/",
      "!! not-null-without-default 0002_add_status.sql:1",
      "     adds a NOT NULL column with no DEFAULT to",
      "     orders: fails on a populated table …",
      "!! index-without-concurrently 0002_add_status.sql:2",
      "     builds an index on orders blocking writes",
      "     for the whole build …",
      "!! drop-column 0003_drop_note.sql:1",
      "     drops a column of orders: the running code",
      "     still selects or inserts it …",
      "3 file(s): 3 error(s), 6 warning(s)",
    ],
  },
  {
    caption: "Rehearsed",
    lines: [
      "$ npx migrations-safe rehearse app.db \\",
      "    0002_add_status.sql 0003_drop_note.sql",
      "runner: plain SQL files · foreign_keys=off",
      "!! FAILED up 0002_add_status.sql:",
      "!!   Cannot add a NOT NULL column with default",
      "!!   value NULL",
      "SKIPPED up 0003_drop_note.sql:",
      "  an earlier migration failed",
      "2 up(s) on a copy of app.db: 1 problem(s),",
      "stopped at 0002_add_status.sql",
    ],
  },
  {
    caption: "Data lost",
    lines: [
      "$ npx migrations-safe rehearse app.db \\",
      "    0003_drop_note.sql",
      "runner: plain SQL files · foreign_keys=off",
      "!! LOST up 0003_drop_note.sql in 124.2 ms",
      "     orders  rows 120  columns: -note (80 non-NULL)",
      "!!   lost: orders.note dropped with 80 non-NULL",
      "!!   value(s)",
      "1 up(s) on a copy of app.db: 1 problem(s)",
      "exit 1",
    ],
  },
]
