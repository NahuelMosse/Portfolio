# Evals for motion-audit

## Should trigger

1. **"The dashboard feels janky when I open the filters drawer. Can you find out why?"**
   Expected: runs `motion-audit.mjs <url> --cpu 4 --click '<drawer trigger>' --interrupt`; reports
   `long-frame` and/or `layout-animated` on the drawer with the measured values; fixes the cause
   (work moved out of the click handler, drawer animated with `transform`); re-runs to exit 0.

2. **"Audit the microinteractions of /settings — every control should respond."**
   Expected: runs the audit, lists `no-feedback`, `snaps` and `no-focus-feedback` per control, adds
   hover/press/focus-visible states sized to frequency (frequent controls get feedback too), re-runs.

3. **"Does our site respect prefers-reduced-motion?"**
   Expected: runs the audit and answers from the reduced-motion findings (`reduced-motion-moves`,
   `-loop`, `-hidden`, `-missing`); fixes with a targeted `prefers-reduced-motion` block that keeps
   opacity/colour feedback, never a global `animation: none !important`.

4. **"If I hover the cards and move away quickly they jump back. Fix it."**
   Expected: `interrupt-jump` on the card hover; diagnoses keyframes (or a JS animation restarting from
   its start value) as the cause; replaces it with a transition or a retargeting spring; re-run shows
   no `interrupt-jump`.

4b. **"Clicking Open while the drawer is still closing makes it jump to the start. Fix it."**
   Expected: runs the audit (toggles are probed without flags); reports `not-interruptible` with the panel and
   the delta; moves the drawer from `@keyframes` classes to a transition (or WAAPI `reverse()`); does not
   disable the button while animating; re-run shows no `not-interruptible`. `fixtures/drawer-bad.html` and
   `drawer-good.html` are the pair.

5. **"Our buttons all animate at different speeds, make the motion consistent."**
   Expected: `inconsistent-duration` and `duration` findings; introduces duration/easing tokens per
   gesture and applies them to every component; re-run shows no inconsistency warnings.

6. **"QA the motion of the landing before release, on a slow phone too."**
   Expected: runs once normally and once with `--cpu 4`, includes `--frames` on the primary CTA and
   looks at the contact sheet; reports exit codes and last lines of both runs; `no-entrance` warnings
   addressed or justified.

## Should not trigger

1. **"Review the animations in this PR diff."** (no running app requested)
   Expected: `review-animations` — a code review against craft standards, not a browser measurement.

2. **"What in this settings page could be animated to make it feel more alive?"**
   Expected: `find-animation-opportunities` — proposing new motion, not auditing existing motion.

3. **"Write a spring for this bottom sheet that follows the finger and can be flung."**
   Expected: `apple-design` / `motion` — building gesture motion, not auditing it.

4. **"Text in the tab bar overflows on mobile."**
   Expected: `fix-overflow` — a layout problem, even though tabs are interactive.
