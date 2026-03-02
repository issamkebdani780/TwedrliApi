import { C } from "../constants";

const STEPS = [
  { step: "01", icon: "📝", color: C.amber, title: "Report",
    desc: "A student loses an item and POSTs it to /products with category, location, and status='lost'. The item enters the system immediately.",
    code: `POST /products\n{\n  "title": "AirPods",\n  "category": "Electronics",\n  "location": "info",\n  "status": "lost",\n  "user_id": 12\n}` },
  { step: "02", icon: "🔍", color: C.teal, title: "Discover",
    desc: "Staff or another student finds the item and updates status to 'found', setting found_by to their user ID. A post is created to notify the community.",
    code: `PUT /products/5\n{ "status": "found", "found_by": 7 }\n\nPOST /posts\n{\n  "user_id": 7,\n  "product_id": 5,\n  "title": "Found AirPods"\n}` },
  { step: "03", icon: "✅", color: C.purple, title: "Claim",
    desc: "The original owner identifies their item and the admin marks it 'claimed'. The lifecycle is complete. All history is preserved.",
    code: `PUT /products/5\n{\n  "status": "claimed"\n}\n\n// 200 OK\n{\n  "message": "Product updated"\n}` },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// How it works</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Three resources.<br />One workflow.</h2>
        <p style={{ color: C.muted, maxWidth: "50ch", fontSize: "1rem", lineHeight: 1.7, marginBottom: 60, fontWeight: 300 }}>
          Users register items, community members post about found objects, and admins manage the entire lifecycle through a clean REST interface.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {STEPS.map(({ step, icon, color, title, desc, code }) => (
            <div key={step} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".68rem", color, border: `1px solid`, borderColor: color, padding: "2px 8px", borderRadius: 100, opacity: .7 }}>{step}</span>
                  <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{title}</h3>
                </div>
                <p style={{ color: C.muted, fontSize: ".88rem", lineHeight: 1.65, marginBottom: 20 }}>{desc}</p>
              </div>
              <pre style={{ background: "#070809", margin: "0 16px 16px", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", fontSize: ".68rem", fontFamily: "'JetBrains Mono', monospace", color: "#a3e635", lineHeight: 1.6, overflow: "auto" }}>{code}</pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}