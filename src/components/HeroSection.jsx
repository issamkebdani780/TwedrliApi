import { C, BASE } from "../constants";

const STATS = [
  { val: "3",     label: "Resource Groups" },
  { val: "15",    label: "API Endpoints" },
  { val: "MySQL", label: "Database" },
  { val: "REST",  label: "Architecture" },
];

export default function HeroSection({ onScrollToDocs }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px max(6vw, 24px) 80px", position: "relative", overflow: "hidden" }}>
      {/* Orbs */}
      <div style={{ position: "absolute", top: -80, right: "5%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,158,11,.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: "8%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: .4 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
        <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,.08)", border: `1px solid rgba(245,158,11,.25)`, borderRadius: 100, padding: "5px 16px", marginBottom: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: C.amber }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, animation: "glow 2s infinite", display: "inline-block" }} />
          Université Abou Bekr Belkaid — Tlemcen
        </div>

        <h1 className="fade-up-1" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: .95, letterSpacing: "-0.04em", marginBottom: 28 }}>
          Lost items,<br /><span style={{ color: C.amber }}>found fast.</span>
        </h1>

        <p className="fade-up-2" style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.7, color: C.muted, maxWidth: "52ch", fontWeight: 300, marginBottom: 40 }}>
          Twedrli is a RESTful lost-and-found platform built for university campuses.
          Students report missing items, staff log what's found — everything syncs in real time via a clean Express + MySQL API.
        </p>

        <div className="fade-up-3" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={onScrollToDocs}
            style={{ background: C.amber, color: "#000", borderRadius: 100, padding: "14px 32px", fontSize: ".95rem", fontWeight: 600, border: "none", cursor: "pointer", transition: "transform .2s, box-shadow .2s", boxShadow: `0 4px 32px rgba(245,158,11,.3)` }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 40px rgba(245,158,11,.4)`; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 32px rgba(245,158,11,.3)`; }}>
            Explore API docs ↓
          </button>
          <a href={BASE} target="_blank" rel="noreferrer"
            style={{ background: "transparent", color: C.text, borderRadius: 100, padding: "14px 32px", fontSize: ".95rem", fontWeight: 500, border: `1px solid ${C.borderBright}`, textDecoration: "none", transition: "border-color .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.amber}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderBright}>
            {BASE.replace("https://", "")} ↗
          </a>
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
          {STATS.map(({ val, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: ".78rem", color: C.muted, marginTop: 4, letterSpacing: ".04em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating terminal — shown ≥1100 px via .terminal-float CSS class */}
      <div className="terminal-float" style={{ position: "absolute", right: "6%", top: "50%", width: 340, background: C.surface, border: `1px solid ${C.borderBright}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)" }}>
        <div style={{ background: "#141620", padding: "10px 14px", display: "flex", gap: 6, alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".7rem", color: C.muted, marginLeft: 8 }}>twedrli-api ~ GET /products</span>
        </div>
        <pre style={{ padding: 16, fontSize: ".7rem", fontFamily: "'JetBrains Mono', monospace", color: "#a3e635", lineHeight: 1.6 }}>
{`$ curl https://twedrliapi.linguaflo.me
     /products

[
  {
    "id": 1,
    "title": "Blue Backpack",
    "status": "lost",
    "location": "math",
    "category": "Other",
    ...
  }
]`}
        </pre>
      </div>
    </section>
  );
}