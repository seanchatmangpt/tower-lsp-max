# REPRESENTATION_MAP

Faithful Next.js representation of the **lsp-max** project. The rule: every
rendered claim is witnessed by real project data — its data path terminates
*outside the component* in an actual artifact, binary, or type. A component that
would render identically if the project were deleted is fabrication and is not
allowed. Each entry cites the real source its data comes from.

App lives in `web/` (App Router, RSC). Data paths resolve to the repo root
(`web/..`) so server components read the project's genuine artifacts.

## Exposed real surface (enumerated by tool)

| Real source | Path / command | Renderable as |
|---|---|---|
| Receipt artifacts (8) | `receipts/*.receipt.json`, `crates/playground/receipts/GALL-CHECKPOINT-*.receipt.json` | receipt ledger: digest, status, claims, replay_pointer |
| OCEL evidence | `crates/playground/ocel/*.ocel.json`, `examples/anti-llm-cheat-lsp/ocel/*` | process-evidence view |
| CLI noun-verb surface (19 nouns) | `crates/lsp-max-cli/src/nouns/*.rs` | command-surface map |
| Example witnesses (run-to-exit) | `cargo run --example {conformance_vector,receipt_chain,calver_law,admission_pipeline}_explained` | live witness output (server action) |
| Doc↔example coverage | `DOC_COVERAGE_LOG.md` | coverage gap map |
| Protocol types | `lsp-max-protocol/src/{conformance,core}.rs` | type surface (ConformanceVector, Receipt, LawAxis) |
| Workspace version | `Cargo.toml` workspace.package.version (CalVer 26.6.9) | version banner |
| Dep surface (Rust + npm) | `Cargo.toml` [workspace.dependencies] + `web/package.json` | dep versions table |

## Gap map (rendered ↔ exposed)

Metric: drive both directions to zero. `❌ exposed-but-unrepresented` = real
capability with no UI. `⚠ rendered-but-fabricated` = UI with no real source (must
be zero at all times — this is the inviolable rule).

| Capability | UI component | Status |
|---|---|---|
| Receipt ledger | `app/receipts` (RSC reads real `*.receipt.json`) | ✅ represented (iter 1) |
| CLI noun-verb surface | `app/cli` (RSC parses real `nouns/*.rs`) | ✅ represented (iter 2) |
| Example witnesses (live run) | `app/witnesses` (RSC parses real DOC_COVERAGE_LOG.md captured run blocks) | ✅ represented (iter 10) |
| Coverage gap map | `app/coverage` (RSC parses real DOC_COVERAGE_LOG.md) | ✅ represented (iter 3) |
| Conformance verdict (live) | `app/conformance` (RSC parses real `conformance.rs` + DOC_COVERAGE_LOG.md) | ✅ represented (iter 8) |
| OCEL process evidence | `app/ocel` (RSC reads real `*.ocel.json`) | ✅ represented (iter 9) |
| Receipt-chain cross-product graph | `app/graph` (RSC parses DOC_COVERAGE_LOG.md WITNESS block + real `*.receipt.json`) | ✅ represented (iter 11) |
| Dep surface (Rust + npm) | `app/deps` (RSC parses real Cargo.toml + package.json) | ✅ represented (iter 12) |

rendered-but-fabricated: **0** (inviolable). exposed-but-unrepresented: 0.

## Iteration log

### Iteration 1 — scaffold + receipt ledger
- Scaffolded Next.js 16 App Router (RSC) in `web/`.
- `web/lib/project.ts`: typed boundary reading real receipt JSON from the repo
  root; throws if the directory/shape is absent (witness: deleting `receipts/`
  breaks the page).
- `app/receipts/page.tsx`: server component renders the 8 real receipts.
- Witness: data path is `fs.readFile(<repo>/receipts/*.receipt.json)` — no fixtures.

### Iteration 1 — render witness + finding
- Build: `npm run build` ✓; `/` and `/receipts` are `ƒ Dynamic` (server-rendered
  from real files at request time, `force-dynamic`).
- Render witness (server started, HTML inspected): `/receipts` rendered real
  identifiers `COMPOSITOR-SCALE-ADMITTED-26.6.9`, `GALL-CHECKPOINT-003..008`,
  `perf-refactors`, status `ADMITTED`, and the real benchmark claim text `CS1
  deposit_contention …` — all parsed from actual `*.receipt.json`. `/` rendered
  7 real receipts, 2 ADMITTED, version 26.6.9 from `Cargo.toml`.
- **Finding (real source is local-only):** root `.gitignore` line 13 `**/receipts/`
  gitignores the receipt artifacts — `git ls-files receipts/` returns 0. The UI
  renders real on-disk artifacts, but they are NOT in version control, so a fresh
  clone would render an empty ledger. Not fabrication (files are real), but the
  witness is environment-local. Recorded, not faked. (The route source
  `web/app/receipts/page.tsx` was force-added past the same ignore rule.)

### Iteration 2 — CLI surface view
- `readCliSurface()` parses `#[verb("…")]` over `pub fn` from the real
  `crates/lsp-max-cli/src/nouns/*.rs`; throws if the noun dir is gone.
- `app/cli/page.tsx`: RSC rendering 18 nouns / ~80 verbs with real arg names.
- Render witness (HTML): real nouns (conformance, diagnostics, snapshot,
  telemetry, admission, metamodel), real verbs (breakdown, score, vector), real
  arg `instance_id` ×102 — parsed from source, not invented.
- exposed-but-unrepresented now 5: example witnesses, coverage map, conformance
  (live), OCEL, receipt-chain graph.

### Iteration 3 — coverage view
- `readCoverage()` parses iteration headers + status rows from the real
  DOC_COVERAGE_LOG.md; throws if absent.
- `app/coverage/page.tsx`: RSC rendering iterations + per-item covered/gap status.
- Render witness (HTML): real example items (conformance_vector_explained.rs,
  receipt_chain_explained.rs), real Iteration 1–6 headers, covered/gap counts.
- exposed-but-unrepresented now 4: example witnesses (live run), conformance
  (live), OCEL evidence, receipt-chain cross-product graph.

### Iteration 8 — conformance surface view
- `readConformanceSurface()` parses `LawAxis` enum variants directly from
  `lsp-max-protocol/src/conformance.rs` (the real Rust source) and the
  `admission_pipeline` WITNESS block from `DOC_COVERAGE_LOG.md`.
- `app/conformance/page.tsx`: RSC rendering all 11 named law axes (Protocol..Domain)
  with their stable IDs and descriptions, plus the 3 pipeline states (A/B/C) from the
  captured WITNESS run. Throws if `conformance.rs` is absent.
- Conformance route added to `web/app/layout.tsx` nav.
- Data source is the real enum — adding or removing a LawAxis variant changes the
  rendered table without touching the component.
- exposed-but-unrepresented now 3: example witnesses (live run), OCEL evidence,
  receipt-chain cross-product graph.

### Iteration 9 — OCEL process evidence view
- `readOcelEvidence()` reads `*.ocel.json` from the two known OCEL directories;
  handles OCEL2 array and object-keyed formats; skips plain inventory arrays.
- `app/ocel/page.tsx`: RSC rendering each OCEL file as a card with event types,
  object types, counts, and a sample-events table.
- OCEL link added to `web/app/layout.tsx` nav.
- exposed-but-unrepresented now 2: example witnesses (live run),
  receipt-chain cross-product graph.

### Iteration 10 — witnesses view
- `readWitnessOutputs()` parses each `**captured run**` block (example name,
  iteration label, WITNESS output lines, exit code) from DOC_COVERAGE_LOG.md;
  throws if absent.
- `app/witnesses/page.tsx`: RSC rendering each witness as a card with example name,
  iteration label, exit code, `<pre>` of output lines, and source footnote.
- Witnesses link added to `web/app/layout.tsx` nav.
- exposed-but-unrepresented now 1: receipt-chain cross-product graph.

### Iteration 11 — receipt-chain cross-product graph
- `readAdmissionGraph()` added to `web/lib/project.ts`: reads
  DOC_COVERAGE_LOG.md (WITNESS block from admission_pipeline Iteration 4),
  parses the three pipeline states [A]/[B]/[C], then cross-products them against
  the real `*.receipt.json` artifacts via `readReceipts()`. Throws if
  DOC_COVERAGE_LOG.md is absent — anti-fabrication boundary holds.
- `app/graph/page.tsx`: RSC rendering pipeline-states table, text flow
  diagram, and receipt cross-product table with axis state and gate verdict per
  receipt. Summary counts (admitted/refused/unknown) from real data. No external
  graph libraries — table/pre representation only.
- Nav link added: `<Link href="/graph">Graph</Link>` in `app/layout.tsx`.
- Note: this iteration closes a **web representation gap**, not a doc↔example
  gap. The admission_pipeline witness was already captured in DOC_COVERAGE_LOG.md
  Iteration 4. This iteration adds the missing UI view that surfaces that data.
- exposed-but-unrepresented now 0.

### Iteration 12 — dep surface + home stats expansion
- `readDepSummary()` added to `web/lib/project.ts`: reads `[workspace.dependencies]`
  block from `Cargo.toml` (pinned-version entries only, path deps skipped) and
  `dependencies` + `devDependencies` from `web/package.json`. Workspace version
  also captured. Throws if either file is absent — anti-fabrication boundary.
- `app/deps/page.tsx`: RSC page (`force-dynamic`) rendering Rust workspace dep
  table and npm package table side-by-side, with source footnotes for each.
- `app/page.tsx`: home page now fetches `readCoverage()` in parallel with
  existing fetches and renders two additional stat cards — covered capabilities
  (linking to /coverage) and open gaps — from real DOC_COVERAGE_LOG.md data.
- `app/layout.tsx`: added `<Link href="/deps">Deps</Link>` to nav.
- Dep surface row added to gap map: ✅ represented. exposed-but-unrepresented: 0.
- Context: this iteration also covers the dep upgrade work (dashmap 6, thiserror 2,
  ureq 3, async-tungstenite 0.29, npm bumps), the law violation sweep
  (TOWER_LSP_MAX_* -> LSP_MAX_*), and stale artifact removal
  (tower-lsp-max-runtime/, stash-wip). Build status for Rust workspace:
  CANDIDATE (requires sibling repos).
