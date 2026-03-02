import { C, BASE } from "../constants";
import { API_GROUPS } from "../data/apiGroups";
import EndpointCard from "./EndpointCard";

export default function ApiDocsSection({ docsRef, activeGroup, setActiveGroup }) {
  const group = API_GROUPS.find(g => g.key === activeGroup);
  return (
    <section id="api" ref={docsRef} style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// API Reference</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 8 }}>Full endpoint docs</h2>
        <p style={{ color: C.muted, marginBottom: 12, fontWeight: 300 }}>
          Base URL: <code style={{ fontFamily: "'JetBrains Mono', monospace", color: C.amber, background: "#1e2028", padding: "2px 8px", borderRadius: 6, fontSize: ".85rem" }}>{BASE}</code>
        </p>
        <p style={{ color: C.muted, fontSize: ".85rem", marginBottom: 44, fontWeight: 300 }}>Click any endpoint to expand request/response details and a ready-to-use cURL command.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {API_GROUPS.map(g => (
            <button key={g.key} onClick={() => setActiveGroup(g.key)}
              style={{ padding: "9px 22px", borderRadius: 100, fontSize: ".85rem", fontWeight: 500, border: `1px solid`, cursor: "pointer", transition: "all .2s", background: activeGroup === g.key ? g.color : "transparent", color: activeGroup === g.key ? "#000" : C.muted, borderColor: activeGroup === g.key ? g.color : C.border }}>
              {g.emoji} {g.label}
            </button>
          ))}
        </div>

        {group && (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 24px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.8rem" }}>{group.emoji}</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>{group.label}</p>
                <p style={{ color: C.muted, fontSize: ".85rem", marginTop: 2 }}>{group.desc}</p>
              </div>
              <span style={{ background: "#1e2028", color: C.muted, fontSize: ".75rem", fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap" }}>
                {group.endpoints.length} endpoints
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {group.endpoints.map((ep, i) => <EndpointCard key={i} ep={ep} baseUrl={BASE} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}