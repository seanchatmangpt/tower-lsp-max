import { readConformanceSurface } from "@/lib/project";

export const dynamic = "force-dynamic";

// LawAxisId stable indices match the order declared in conformance.rs (0 = Protocol, 10 = Domain).
// Descriptions are drawn from the doc comments and Display impls in the same source file.
const AXIS_DESCRIPTIONS: Record<string, string> = {
  Protocol: "LSP 3.18 method and notification surface coverage",
  Type: "Type correctness across protocol types and generated structs",
  Fixture: "Fixture fidelity — negative-control fixtures do not collapse",
  Documentation: "Doc-to-example bijection (DOC_COVERAGE_LOG)",
  Release: "Release gate: CalVer law, gate-check passage, no ANDON",
  Hook: "PreToolUse / PostToolUse hook coverage and correctness",
  Repair: "Repair plan generation and gate-reset coverage",
  Receipt: "BLAKE3 content-addressing and receipt chain integrity",
  Security: "Secret-scanning gate, no credentials in artifacts",
  Autopoiesis: "Self-referential invariants: the runtime models itself",
  Domain: "Process-mining domain surface (wasm4pm / POWL conformance)",
};

export default async function ConformancePage() {
  const surface = await readConformanceSurface();

  return (
    <section>
      <h1>Conformance surface</h1>
      <p className="lede">
        Parsed live from <code>lsp-max-protocol/src/conformance.rs</code>.{" "}
        The <code>ConformanceVector</code> type carries three disjoint sets —
        Admitted, Refused, Unknown — across {surface.axes.length} named law axes.
        Unknown never collapses into Admitted or Refused; doing so is a defect.
      </p>

      <h2 className="sub">Law axes ({surface.axes.length} named)</h2>
      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th>
            <th>Axis</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {surface.axes.map((axis) => (
            <tr key={axis.name}>
              <td className="mono">{axis.id}</td>
              <td className="mono">{axis.name}</td>
              <td>{AXIS_DESCRIPTIONS[axis.name] ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {surface.pipelineStates.length > 0 && (
        <>
          <h2 className="sub">Admission pipeline (witnessed)</h2>
          <p className="lede">
            From the captured run of <code>examples/admission_pipeline.rs</code>{" "}
            in <code>DOC_COVERAGE_LOG.md</code> (Iteration 4). Three composed states
            show receipt verification driving the gate end-to-end.
          </p>
          <table className="tbl">
            <thead>
              <tr>
                <th>State</th>
                <th>Condition</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {surface.pipelineStates.map((s) => (
                <tr key={s.label}>
                  <td className="mono">[{s.label}]</td>
                  <td>{s.description}</td>
                  <td className="mono">{s.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <p className="src">
        ↳ lsp-max-protocol/src/conformance.rs + DOC_COVERAGE_LOG.md
      </p>
    </section>
  );
}
