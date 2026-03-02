import { C } from "../constants";
import { TECH, ARCHITECTURE, ROUTERS } from "../data/tech";

export default function TechStackSection() {
  return (
    <section id="stack" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// Built with</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 48 }}>Tech stack</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {TECH.map(({ name, role, icon, color }) => (
            <div key={name}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", transition: "border-color .2s, transform .2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{icon}</div>
              <p style={{ fontWeight: 600, fontSize: ".95rem", color: C.text }}>{name}</p>
              <p style={{ fontSize: ".8rem", color: C.muted, marginTop: 4 }}>{role}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "32px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 32 }}>Architecture</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {ARCHITECTURE.map((item, i) =>
              item.label === "→"
                ? <span key={i} style={{ color: C.faint, fontSize: "1.2rem" }}>→</span>
                : <div key={i} style={{ border: `1px solid`, borderColor: item.color, borderRadius: 8, padding: "8px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: ".78rem", color: item.color, background: `${item.color}0d` }}>{item.label}</div>
            )}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {ROUTERS.map(r => (
              <span key={r.label} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: r.color, background: `${r.color}12`, border: `1px solid ${r.color}30`, borderRadius: 6, padding: "4px 12px" }}>{r.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}