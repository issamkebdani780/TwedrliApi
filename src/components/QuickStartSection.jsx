import { C, BASE } from "../constants";
import CopyBtn from "./CopyBtn";

const QUICK_CURL = `# Get all lost items\ncurl ${BASE}/products\n\n# Get all users\ncurl ${BASE}/users\n\n# Get all posts with user and product details\ncurl ${BASE}/posts`;

export default function QuickStartSection() {
  return (
    <section style={{ padding: "80px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Start in 30 seconds</h2>
        <p style={{ color: C.muted, marginBottom: 36, fontWeight: 300 }}>No auth required. Hit the live API directly.</p>
        <div style={{ background: "#070809", border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 28px", textAlign: "left", position: "relative" }}>
          <div style={{ position: "absolute", top: 14, right: 14 }}><CopyBtn text={QUICK_CURL} /></div>
          <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".82rem", color: "#67e8f9", lineHeight: 1.8, overflowX: "auto" }}>{QUICK_CURL}</pre>
        </div>
      </div>
    </section>
  );
}