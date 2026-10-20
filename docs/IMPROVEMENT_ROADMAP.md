# Lost & Found System — Prioritized Improvement Roadmap

This roadmap is incremental. Each phase should ship as a reviewable, tested release rather than introducing multiple unverified workflows at once.

## Product objective

Help people report items, discover likely matches, verify ownership safely, and complete a documented handoff with as little friction as possible.

## P0 — Reliability and safety

- [x] Run client lint/build and backend syntax/test checks in CI.
- [ ] Verify production API behavior for registration, listing creation, claims, chat, reports, and saved listings.
- [ ] Add request-level tests for authentication, authorization, validation, and error responses.
- [ ] Review dependency and secret hygiene; keep credentials outside the repository.
- [ ] Improve accessibility, mobile layout, loading, empty, and failure states.
- [ ] Confirm data-retention and image cleanup behavior when listings are deleted.

Exit criteria: checks are repeatable; sensitive claim/contact information is not public; core journeys pass staging verification.

## P1 — Discovery and matching (current release)

- [x] Explainable rule-based matching across opposite report types.
- [x] Rank candidate matches using category, title, description, location, and date.
- [x] Persist in-app notifications for possible matches.
- [x] Add authenticated notification inbox and read/unread state.
- [x] Test match scoring with Node's built-in test runner.
- [x] Add user-facing match suggestions to each owner's open report.
- [ ] Add optional email delivery (in-app match notification preference is implemented; email requires a configured provider).
- [x] Collect opt-in helpful/not-a-match feedback for suggested matches before considering ML or image similarity.

Design note: match scores are heuristic suggestions, not proof of ownership. Users must verify distinctive details through the claim workflow.

## P2 — Safe and transparent recovery

- [ ] Add structured claim evidence (private identifying details, optional receipt/serial details).
- [x] Track handoff/recovery explicitly instead of treating claim approval as confirmed return.
- [ ] Add dispute escalation and audit history for claim status changes.
- [ ] Ensure a claim is approved only by the listing owner/admin policy and avoid concurrent double-approval.
- [ ] Improve chat abuse reporting, block/mute controls, and contact-detail privacy.

## P3 — Better reporting and search

- [x] Advanced filters for category, date range, status, and location.
- [x] Duplicate listing warnings before submission.
- [ ] Optional multiple-image upload with clear privacy guidance.
- [ ] Configurable report expiry/archive flow that preserves audit history.
- [ ] Optional approximate campus map once location quality and consent are established.

## P4 — Operations and adoption

- [x] Admin analytics for category, report type, claim status, and monthly listing trends. Recovery rate/time-to-recovery remains future work.
- [x] CSV export with privacy-aware fields and admin authorization.
- [ ] Verified organization/campus accounts and configurable domain policy.
- [ ] Accessible multilingual UI and optional email alerts.
- [ ] QR codes for report links and a lightweight mobile-first reporting flow.

## Release process

1. Create a feature branch from current main.
2. Keep each release scoped and backwards compatible.
3. Add automated tests for scoring, validators, and permission rules.
4. Run npm test, npm run lint, and npm run build where configured.
5. Open a pull request with limitations and evidence.
6. Merge only when code review and available checks are clean.
7. Verify Render and Vercel deployment status and smoke-test production endpoints without creating or modifying real user records.

## Current implementation

The first delivery adds rule-based matching, persistent match notifications, notification read state, and a testable matching score. Remaining unchecked items are follow-up releases, not claims that they are already implemented.


## Follow-up hardening release (in progress)

- Added automated service-level checks that the matching workflow creates reciprocal notifications for both reporters, suppresses weak matches, and uses idempotent upserts.
- Added an opt-in two-account API test harness that verifies reciprocal match results and persisted notifications and attempts to clean up its own test artifacts. It requires dedicated test accounts; it is not executed against production automatically.
- Added authenticated notification dismissal, restricted to the signed-in user's own notification.
- Added opt-in helpful/not-a-match feedback for suggestions, scoped to the reporter and only accepted for a currently suggested match; saved feedback is returned with the match list and removed when either report is deleted.
- Added recovery progress for approved claims, including handoff arranged/recovered/disputed states, private participant notes, and an audit history. Full dispute escalation and notification to admins remain future work.
- Added a profile setting to opt out of in-app match alerts while keeping ranked suggestions available on the user's reports; email alerts remain unconfigured.
- Added a best-effort duplicate warning before publishing and public search filters for keyword, report type, category, location, status, and date range.
- Remaining verification gate: run the two-account harness against an isolated staging deployment with dedicated test accounts before treating live end-to-end matching as verified.
