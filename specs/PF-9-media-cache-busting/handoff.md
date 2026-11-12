# PF-9 handoff

Done and committed: content.ts back to plain paths; showcase-device.tsx versions poster and video with mediaUrl; piece-image.ts fallback returns mediaUrl(plain(src)); unused `--paper-texture` removed from design/tokens.css; the URL test replaced by e2e/media-cache-busting-urls.spec.ts (regex excludes the backslash of escaped flight data).

Last run on a fresh build (29 passed, 9 failed), before the replacement test existed:
- media-cache-busting.spec.ts: only the URL test failed (replaced since).
- best-screens.spec.ts 144 and 167 FAIL: "cebador beat 0 at 1440 lead screen", Expected "cebador-1280", Received null; deterministic at workers=1; the test reads video.poster (a data URI) first; cause not found.
- smoke.spec.ts webkit 390: cebador webm videos stay at readyState 0.
- lab-links (4) and retired-bulk (1): failed in the first verify suite.log too.

## Not covered (turn budget)
- *could not run*: media-cache-busting-urls.spec.ts against the new build.
- *could not run*: root cause of best-screens 144/167 and of the webkit smoke video failure.
- *could not run*: the Log line `replaces: e2e/media-cache-busting.spec.ts "every /film URL..." · regex took the trailing backslash of escaped flight data · by: e2e/media-cache-busting-urls.spec.ts "every /film URL..."` (log.mjs).
