import { readOcelEvidence, type OcelFile } from "@/lib/project";

export const dynamic = "force-dynamic"; // always read the real files at request time

function OcelCard({ f }: { f: OcelFile }) {
  return (
    <article className="card">
      <div className="card-head">
        <h3 className="mono">{f.sourceFile.split("/").pop()}</h3>
        <span className="badge badge-unknown">{f.eventCount} events</span>
      </div>
      <dl className="kv">
        <dt>event types</dt>
        <dd>
          {f.eventTypes.length > 0
            ? f.eventTypes.map((et) => et.name).join(", ")
            : <span className="dim">none declared</span>}
        </dd>
        <dt>object types</dt>
        <dd>
          {f.objectTypes.length > 0
            ? f.objectTypes.map((ot) => ot.name).join(", ")
            : <span className="dim">none declared</span>}
        </dd>
        <dt>objects</dt>
        <dd>{f.objectCount}</dd>
      </dl>
      {f.sampleEvents.length > 0 && (
        <>
          <p className="dim" style={{ fontSize: 12, margin: "8px 0 4px" }}>
            Sample events (first {f.sampleEvents.length})
          </p>
          <table className="tbl">
            <thead>
              <tr>
                <th>id</th>
                <th>type</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {f.sampleEvents.map((ev) => (
                <tr key={ev.id}>
                  <td className="mono small">{ev.id}</td>
                  <td className="mono small">{ev.type}</td>
                  <td className="mono small dim">{ev.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <p className="src">{"↳ "}{f.sourceFile}</p>
    </article>
  );
}

export default async function OcelPage() {
  // Real data path: fs reads of *.ocel.json files in the project. Removing the
  // OCEL directories causes this page to throw — the witness against fabrication.
  const files = await readOcelEvidence();
  const totalEvents = files.reduce((n, f) => n + f.eventCount, 0);
  const totalObjects = files.reduce((n, f) => n + f.objectCount, 0);
  return (
    <section>
      <h1>OCEL process evidence</h1>
      <p className="lede">
        {files.length} real OCEL file{files.length !== 1 ? "s" : ""} parsed from
        the repository ({totalEvents} events, {totalObjects} objects). Every type
        name, event id, and timestamp below is read from an actual{" "}
        <code>*.ocel.json</code> on disk.
      </p>
      <div className="stats">
        <div className="stat">
          <span className="stat-n">{files.length}</span>
          <span className="stat-l">OCEL files</span>
        </div>
        <div className="stat">
          <span className="stat-n">{totalEvents}</span>
          <span className="stat-l">total events</span>
        </div>
        <div className="stat">
          <span className="stat-n">{totalObjects}</span>
          <span className="stat-l">total objects</span>
        </div>
      </div>
      <div className="grid">
        {files.map((f) => (
          <OcelCard key={f.sourceFile} f={f} />
        ))}
      </div>
    </section>
  );
}
