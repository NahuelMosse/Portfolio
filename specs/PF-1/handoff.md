# Handoff: phone fit passes (designer)

## Done (committed in app/globals.css, inside `max-width:700px`)
- Offer fills the screen: free height split into two equal auto margins (commit 124b32e). Measured FITS at 390x844, 414x896, 360x740; 375x667 grows 32px.
- Let's talk: address on one line (`min(7.7vw, 5.4svh)`, nowrap), hint tight under it, `.end-of-file` margin-top 0, tiles `margin-top: auto`. Committed; hash not read back (`git log -1`).

## Not covered (turn budget), all could not run
- Final measure of the Let's talk CSS: `node lt-dom.cjs`, `node lt-measure.cjs`, `node walk2.cjs n390 390 844` in `D:/tmp/ia3` (NODE_PATH=/d/projects/Portfolio-d/node_modules, dev server on 8707). At 360 the hint may still wrap; the email at 7.7vw is unverified at 360 and 414.
- Phone type pass (offer body 16px/1.45, kickers >=13px, door titles 24-26px, OFFER word 72-88px, CTA >=14px, sweep of cover, projects, experience and Let's talk for body <15px and labels <12px): not started.
