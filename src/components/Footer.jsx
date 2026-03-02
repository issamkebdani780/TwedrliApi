import { C, BASE } from "../constants";

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px max(6vw, 24px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${C.amber}, #ef4444)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#000" }}>T</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".95rem" }}>twedrli</span>
        <span style={{ color: C.faint, fontSize: ".8rem" }}>— Lost & Found Platform</span>
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <a href={BASE} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.muted, textDecoration: "none" }}>API ↗</a>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.faint }}>Univ. Abu Baker Belkaid · Tlemcen, DZ</span>
        <span style={{ color: C.faint, fontSize: ".75rem" }}>·</span>
        <span style={{ fontSize: ".82rem", color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
          Powered by{" "}
          <a href="https://www.linkedin.com/in/issam-kebdani-8b6154334" target="_blank" rel="noreferrer"
            style={{ color: C.amber, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Issam Kebdani
          </a>
        </span>
      </div>
    </footer>
  );
}