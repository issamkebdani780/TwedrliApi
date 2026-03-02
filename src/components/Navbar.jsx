import { C, BASE } from "../constants";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#api",          label: "API Docs" },
  { href: "#schema",       label: "Schema" },
  { href: "#stack",        label: "Stack" },
];

export default function Navbar({ scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(11,12,15,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all .3s", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 max(6vw, 24px)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.amber}, #ef4444)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "#000",
        }}>T</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          twedrli
        </span>
        <span style={{
          background: "#1e2028", color: C.amber, border: `1px solid #2a2d38`,
          fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace",
          padding: "2px 8px", borderRadius: 100, letterSpacing: ".08em",
          fontWeight: 500, textTransform: "uppercase",
        }}>v1.0</span>
      </div>

      {/* Links — hidden below 700 px via global CSS */}
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href}
            style={{ color: C.muted, fontSize: ".85rem", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
            onMouseEnter={e => e.target.style.color = C.text}
            onMouseLeave={e => e.target.style.color = C.muted}>
            {label}
          </a>
        ))}
        <a href={BASE} target="_blank" rel="noreferrer"
          style={{
            background: C.amber, color: "#000", borderRadius: 100,
            padding: "7px 20px", fontSize: ".82rem", fontWeight: 600,
            textDecoration: "none", transition: "opacity .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          Live API ↗
        </a>
      </div>
    </nav>
  );
}