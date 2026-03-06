import { C } from "../constants";
import { SCHEMA, CONSTRAINTS } from "../data/schema";

export default function SchemaSection() {
  return (
    <section id="schema" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// Database Schema</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 48 }}>MySQL 8 tables</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {SCHEMA.map(({ table, color, fields }) => (
            <div key={table} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: ".9rem", color }}>{table}</span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {fields.map(f => (
                  <div key={f.name} style={{ display: "flex", justifyContent: "space-between", padding: "7px 20px", gap: 12, flexWrap: "wrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#141620"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".78rem", color: C.amber }}>{f.name}</code>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.muted }}>{f.type}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}