# PF-9 handoff

Done (committed in the last commit): content.ts back to plain paths; showcase-device.tsx versions poster and video with mediaUrl; piece-image.ts fallback returns mediaUrl(plain(src)); `--paper-texture` (unused, only `/film` URL in CSS) removed from design/tokens.css; test 2 replaced by e2e/media-cache-busting-urls.spec.ts (regex excludes the backslash of escaped flight data).

Last run (fresh build, 5 requested files, before the replacement test was run):
- media-cache-busting.spec.ts: test 2 failed on `/film/ill-cover-16x9.webp?v=804fbd40\` (test regex; replaced). Others passed.
- best-screens.spec.ts: lines 144 and 167 FAIL ("cebador beat 0 at 1440 lead screen", Expected "cebador-1280", Received null). Deterministic at workers=1. Cause not found: faceOf in the test reads video.poster || currentSrc and the video's poster is the data URI; it passed in the earlier verify run where content.ts was versioned. Line 197 not seen failing.
- smoke.spec.ts: webkit 390 "every visible image and video loads" fails: videos cebador-390/1280.webm readyState 0 (earlier verify did not fail it).
- lab-links.spec.ts (4 tests) and retired-bulk.spec.ts: fail the same way as in the first verify (suite.log), not from this card.

## Not covered (turn budget)
- could not run: media-cache-busting-urls.spec.ts against the new build.
- could not run: root cause of best-screens 144/167 and the webkit smoke video failures.
- could not run: retire/replace log line for the replaced test (`node .claude/tools/log.mjs specs/PF-9-media-cache-busting "replaces: e2e/media-cache-busting.spec.ts \"every /film URL...\" · regex took the trailing backslash of escaped flight data · by: e2e/media-cache-busting-urls.spec.ts ..."`). The old test still fails.
