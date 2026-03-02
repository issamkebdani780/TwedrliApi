import { useState, useEffect, useRef } from "react";

const BASE = "https://twedrliapi.linguaflo.me";

// ── colour tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0b0c0f",
  surface: "#111318",
  border: "#1e2028",
  borderBright: "#2a2d38",
  amber: "#f59e0b",
  amberDim: "#d97706",
  ember: "#ef4444",
  teal: "#10b981",
  purple: "#8b5cf6",
  text: "#e8e6e1",
  muted: "#6b7280",
  faint: "#374151",
};

// ── Method badge colours ───────────────────────────────────────────────────────
const METHOD_STYLE = {
  GET:    { bg: "#0d3b26", text: "#34d399", border: "#065f46" },
  POST:   { bg: "#1c2a4a", text: "#60a5fa", border: "#1e3a5f" },
  PUT:    { bg: "#2d2507", text: "#fbbf24", border: "#78350f" },
  DELETE: { bg: "#3b0f0f", text: "#f87171", border: "#7f1d1d" },
};

// ── API data ───────────────────────────────────────────────────────────────────
const API_GROUPS = [
  {
    key: "products",
    label: "Products",
    emoji: "📦",
    color: C.amber,
    desc: "Lost & found item records. Each product belongs to a user and tracks status lifecycle.",
    endpoints: [
      {
        method: "GET", path: "/products",
        summary: "List all products",
        desc: "Returns all products ordered by date DESC.",
        response: `[\n  {\n    "id": 1,\n    "title": "Blue Backpack",\n    "description": "Left in Math building",\n    "category": "Other",\n    "status": "lost",\n    "location": "math",\n    "date": "2025-03-01T10:00:00.000Z",\n    "user_id": 3,\n    "found_by": null\n  }\n]`,
      },
      {
        method: "GET", path: "/products/:id",
        summary: "Get product by ID",
        desc: "Returns a single product with owner name and email joined from users.",
        params: [{ name: "id", type: "integer", desc: "Product ID" }],
        response: `{\n  "id": 1,\n  "title": "Blue Backpack",\n  "owner_name": "Ahmed Bensalem",\n  "owner_email": "ahmed@univ-tlemcen.dz",\n  ...\n}`,
      },
      {
        method: "POST", path: "/products",
        summary: "Report a new item",
        desc: "Creates a new lost/found product entry.",
        body: [
          { name: "title", type: "string", required: true, desc: "Item title" },
          { name: "description", type: "string", required: false, desc: "Item description" },
          { name: "category", type: "enum", required: true, desc: "Fashion | Electronics | Home & Living | Beauty | Sport | Books | Other" },
          { name: "location", type: "enum", required: true, desc: "info | sm | st | math" },
          { name: "status", type: "enum", required: false, desc: "lost (default) | found | claimed" },
          { name: "user_id", type: "integer", required: true, desc: "Reporting user ID" },
          { name: "found_by", type: "integer", required: false, desc: "User ID who found it" },
        ],
        response: `{ "message": "Product reported", "id": 7 }`,
      },
      {
        method: "PUT", path: "/products/:id",
        summary: "Update a product",
        desc: "Partial update — only provided fields are changed via COALESCE.",
        body: [
          { name: "title", type: "string", required: false },
          { name: "description", type: "string", required: false },
          { name: "category", type: "enum", required: false },
          { name: "location", type: "enum", required: false },
          { name: "status", type: "enum", required: false },
          { name: "found_by", type: "integer", required: false },
        ],
        response: `{ "message": "Product updated successfully" }`,
      },
      {
        method: "DELETE", path: "/products/:id",
        summary: "Delete a product",
        desc: "Permanently removes the product record.",
        response: `{ "message": "Product deleted" }`,
      },
    ],
  },
  {
    key: "users",
    label: "Users",
    emoji: "👤",
    color: C.purple,
    desc: "University student and admin accounts. Roles are enforced via DB check constraints.",
    endpoints: [
      {
        method: "GET", path: "/users",
        summary: "List all users",
        desc: "Returns id, name, email, role, department, created_at — password is excluded.",
        response: `[\n  {\n    "id": 1,\n    "name": "Yacine Belkadi",\n    "email": "y.belkadi@univ-tlemcen.dz",\n    "role": "admin",\n    "department": "info",\n    "created_at": "2025-01-15T09:22:00.000Z"\n  }\n]`,
      },
      {
        method: "GET", path: "/users/email/:email",
        summary: "Get user by email",
        desc: "Useful for login lookups. Returns 404 if not found.",
        params: [{ name: "email", type: "string", desc: "User email address" }],
        response: `{\n  "id": 2,\n  "name": "Sara Boudjemaa",\n  "email": "sara@univ-tlemcen.dz",\n  "role": "user",\n  "department": "sm"\n}`,
      },
      {
        method: "POST", path: "/users",
        summary: "Create a user",
        desc: "Register a new student or admin account.",
        body: [
          { name: "name", type: "string", required: true },
          { name: "email", type: "string", required: true, desc: "Must be unique" },
          { name: "password", type: "string", required: true, desc: "Store hashed in production" },
          { name: "role", type: "enum", required: false, desc: "user (default) | admin" },
          { name: "department", type: "enum", required: true, desc: "math | sm | info | st" },
        ],
        response: `{ "message": "User created", "userId": 5 }`,
      },
      {
        method: "PUT", path: "/users/:id",
        summary: "Update a user",
        desc: "Partial update on name, email, role, department.",
        body: [
          { name: "name", type: "string", required: false },
          { name: "email", type: "string", required: false },
          { name: "role", type: "enum", required: false },
          { name: "department", type: "enum", required: false },
        ],
        response: `{ "message": "User updated successfully" }`,
      },
      {
        method: "DELETE", path: "/users/:id",
        summary: "Delete a user",
        desc: "Returns 400 if the user has linked posts or products (FK constraint).",
        response: `{ "message": "User deleted successfully", "deletedId": "3" }`,
      },
    ],
  },
  {
    key: "posts",
    label: "Posts",
    emoji: "📋",
    color: C.teal,
    desc: "Community posts that reference a product and an author. Joins both tables on read.",
    endpoints: [
      {
        method: "GET", path: "/posts",
        summary: "List all posts",
        desc: "Returns enriched posts with nested user and product objects.",
        response: `[\n  {\n    "id": 1,\n    "title": "Found a backpack near SM",\n    "description": "Blue bag with laptop inside",\n    "created_at": "2025-03-01T12:00:00.000Z",\n    "user": {\n      "name": "Sara B.",\n      "email": "sara@univ-tlemcen.dz",\n      "avatar": "S"\n    },\n    "product": {\n      "category": "Electronics",\n      "status": "found",\n      "location": "sm",\n      "img": "https://via.placeholder.com/300"\n    }\n  }\n]`,
      },
      {
        method: "GET", path: "/posts/:id",
        summary: "Get post by ID",
        desc: "Single post with author_name and product_title joined.",
        params: [{ name: "id", type: "integer", desc: "Post ID" }],
        response: `{\n  "id": 1,\n  "title": "Found a backpack",\n  "author_name": "Sara B.",\n  "product_title": "Blue Backpack",\n  ...\n}`,
      },
      {
        method: "POST", path: "/posts",
        summary: "Create a post",
        desc: "Validates both user_id and product_id exist before inserting.",
        body: [
          { name: "user_id", type: "integer", required: true },
          { name: "product_id", type: "integer", required: true },
          { name: "title", type: "string", required: true },
          { name: "description", type: "string", required: false },
        ],
        response: `{ "message": "Post created successfully", "postId": 4 }`,
      },
      {
        method: "PUT", path: "/posts/:id",
        summary: "Update a post",
        desc: "Validates foreign keys if user_id or product_id are changed.",
        body: [
          { name: "title", type: "string", required: false },
          { name: "description", type: "string", required: false },
          { name: "user_id", type: "integer", required: false },
          { name: "product_id", type: "integer", required: false },
        ],
        response: `{ "message": "Post updated successfully" }`,
      },
      {
        method: "DELETE", path: "/posts/:id",
        summary: "Delete a post",
        desc: "Returns 404 if post doesn't exist.",
        response: `{ "message": "Post deleted successfully" }`,
      },
    ],
  },
];

// ── Schema data ────────────────────────────────────────────────────────────────
const SCHEMA = [
  {
    table: "users",
    color: C.purple,
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(150) UNIQUE" },
      { name: "password", type: "VARCHAR(255)" },
      { name: "role", type: "'user' | 'admin'" },
      { name: "department", type: "'math'|'sm'|'info'|'st'" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    table: "products",
    color: C.amber,
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "category", type: "Fashion|Electronics|..." },
      { name: "status", type: "'lost'|'found'|'claimed'" },
      { name: "location", type: "'info'|'sm'|'st'|'math'" },
      { name: "date", type: "TIMESTAMP" },
      { name: "user_id", type: "INT FK → users" },
      { name: "found_by", type: "INT FK → users (nullable)" },
    ],
  },
  {
    table: "posts",
    color: C.teal,
    fields: [
      { name: "id", type: "INT PK AI" },
      { name: "user_id", type: "INT FK → users" },
      { name: "product_id", type: "INT FK → products" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "description", type: "TEXT" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
];

const TECH = [
  { name: "Node.js", role: "Runtime", icon: "⚡", color: "#68a063" },
  { name: "Express.js", role: "Web Framework", icon: "🚂", color: "#ffffff" },  
  { name: "mysql2", role: "DB Driver (promise)", icon: "🔌", color: "#f59e0b" },
  { name: "dotenv", role: "Config / Env", icon: "🔑", color: "#8b5cf6" },
  { name: "CORS", role: "Cross-Origin", icon: "🌐", color: "#10b981" },
  { name: "React 18", role: "Admin UI", icon: "⚛️", color: "#61dafb" },
  { name: "Tailwind CSS", role: "Styling", icon: "🎨", color: "#38bdf8" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function MethodBadge({ method }) {
  const s = METHOD_STYLE[method] || METHOD_STYLE.GET;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="text-xs font-bold px-2 py-0.5 rounded font-mono tracking-wide">
      {method}
    </span>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button onClick={copy}
      className="text-xs px-2 py-1 rounded transition-colors"
      style={{ background: copied ? "#065f46" : "#1e2028", color: copied ? "#34d399" : "#9ca3af" }}>
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function EndpointCard({ ep, baseUrl }) {
  const [open, setOpen] = useState(false);
  const curlCmd = ep.method === "GET"
    ? `curl ${baseUrl}${ep.path.replace(":id", "1")}`
    : ep.method === "DELETE"
    ? `curl -X DELETE ${baseUrl}${ep.path.replace(":id", "1")}`
    : `curl -X ${ep.method} ${baseUrl}${ep.path.replace(":id", "1")} \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(
        (ep.body || []).filter(b => b.required).reduce((a, b) => ({ ...a, [b.name]: b.type === "integer" ? 1 : "value" }), {}),
        null, 2)}'`;

  return (
    <div style={{ background: C.surface, border: `1px solid ${open ? C.borderBright : C.border}` }}
      className="rounded-xl overflow-hidden transition-all">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left group">
        <MethodBadge method={ep.method} />
        <span className="font-mono text-sm" style={{ color: C.text }}>{ep.path}</span>
        <span className="text-sm ml-2" style={{ color: C.muted }}>{ep.summary}</span>
        <span className="ml-auto text-xs" style={{ color: C.muted }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }} className="px-5 py-4 space-y-4">
          <p className="text-sm" style={{ color: C.muted }}>{ep.desc}</p>

          {ep.params && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: C.faint }}>Path Params</p>
              <div className="space-y-1">
                {ep.params.map(p => (
                  <div key={p.name} className="flex items-center gap-3 text-sm">
                    <code className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "#1a1d26", color: C.amber }}>{p.name}</code>
                    <span style={{ color: C.muted }}>{p.type}</span>
                    {p.desc && <span style={{ color: C.faint }}>— {p.desc}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {ep.body && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: C.faint }}>Request Body</p>
              <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "#141620" }}>
                      {["Field", "Type", "Required", "Notes"].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold uppercase tracking-wider" style={{ color: C.faint }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ep.body.map((b, i) => (
                      <tr key={b.name} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : "#0e1015" }}>
                        <td className="px-3 py-2 font-mono" style={{ color: C.amber }}>{b.name}</td>
                        <td className="px-3 py-2" style={{ color: C.purple }}>{b.type}</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{ background: b.required ? "#1c2a4a" : "#1a1d26", color: b.required ? "#60a5fa" : C.faint }}>
                            {b.required ? "required" : "optional"}
                          </span>
                        </td>
                        <td className="px-3 py-2" style={{ color: C.muted }}>{b.desc || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.faint }}>Response</p>
              <CopyBtn text={ep.response} />
            </div>
            <pre className="text-xs rounded-lg p-4 overflow-x-auto leading-relaxed"
              style={{ background: "#070809", border: `1px solid ${C.border}`, color: "#a3e635", fontFamily: "'JetBrains Mono', monospace" }}>
              {ep.response}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.faint }}>cURL Example</p>
              <CopyBtn text={curlCmd} />
            </div>
            <pre className="text-xs rounded-lg p-4 overflow-x-auto leading-relaxed"
              style={{ background: "#070809", border: `1px solid ${C.border}`, color: "#67e8f9", fontFamily: "'JetBrains Mono', monospace" }}>
              {curlCmd}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
export default function TwedrliLanding() {
  const [activeGroup, setActiveGroup] = useState("products");
  const [scrolled, setScrolled] = useState(false);
  const docsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const group = API_GROUPS.find(g => g.key === activeGroup);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2a2d38; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .fade-up { animation: fadeUp .7s both; }
        .fade-up-1 { animation: fadeUp .7s .1s both; }
        .fade-up-2 { animation: fadeUp .7s .2s both; }
        .fade-up-3 { animation: fadeUp .7s .3s both; }
        .float { animation: float 4s ease-in-out infinite; }
        .endpoint-hover:hover { border-color: #2a2d38 !important; }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(11,12,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all .3s",
        padding: "0 max(6vw, 24px)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["#how-it-works", "#api", "#schema", "#stack"].map((href, i) => (
            <a key={href} href={href}
              style={{ color: C.muted, fontSize: ".85rem", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.text}
              onMouseLeave={e => e.target.style.color = C.muted}>
              {["How it works", "API Docs", "Schema", "Stack"][i]}
            </a>
          ))}
          <a href={BASE} target="_blank" rel="noreferrer"
            style={{
              background: C.amber, color: "#000", borderRadius: 100,
              padding: "7px 20px", fontSize: ".82rem", fontWeight: 600,
              textDecoration: "none", transition: "opacity .2s",
            }}
            onMouseEnter={e => e.target.style.opacity = ".85"}
            onMouseLeave={e => e.target.style.opacity = "1"}>
            Live API ↗
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px max(6vw, 24px) 80px", position: "relative", overflow: "hidden" }}>
        {/* background orbs */}
        <div style={{ position: "absolute", top: -80, right: "5%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,158,11,.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "8%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, rgba(139,92,246,.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%)`, pointerEvents: "none" }} />

        {/* grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px", opacity: .4,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(245,158,11,.08)", border: `1px solid rgba(245,158,11,.25)`,
            borderRadius: 100, padding: "5px 16px", marginBottom: 28,
            fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem",
            fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: C.amber,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, animation: "glow 2s infinite", display: "inline-block" }} />
            Université Abou Bekr Belkaid — Tlemcen
          </div>

          <h1 className="fade-up-1" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: .95,
            letterSpacing: "-0.04em", marginBottom: 28,
          }}>
            Lost items,<br />
            <span style={{ color: C.amber }}>found fast.</span>
          </h1>

          <p className="fade-up-2" style={{
            fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.7,
            color: C.muted, maxWidth: "52ch", fontWeight: 300, marginBottom: 40,
          }}>
            Twedrli is a RESTful lost-and-found platform built for university campuses.
            Students report missing items, staff log what's found — everything syncs in real time
            via a clean Express + MySQL API.
          </p>

          <div className="fade-up-3" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => docsRef.current?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: C.amber, color: "#000", borderRadius: 100,
                padding: "14px 32px", fontSize: ".95rem", fontWeight: 600,
                border: "none", cursor: "pointer", transition: "transform .2s, box-shadow .2s",
                boxShadow: `0 4px 32px rgba(245,158,11,.3)`,
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 40px rgba(245,158,11,.4)`; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 32px rgba(245,158,11,.3)`; }}>
              Explore API docs ↓
            </button>
            <a href={BASE} target="_blank" rel="noreferrer"
              style={{
                background: "transparent", color: C.text, borderRadius: 100,
                padding: "14px 32px", fontSize: ".95rem", fontWeight: 500,
                border: `1px solid ${C.borderBright}`, cursor: "pointer",
                textDecoration: "none", transition: "border-color .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.amber}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.borderBright}>
              {BASE.replace("https://", "")} ↗
            </a>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
            {[
              { val: "3", label: "Resource Groups" },
              { val: "15", label: "API Endpoints" },
              { val: "MySQL", label: "Database" },
              { val: "REST", label: "Architecture" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: ".78rem", color: C.muted, marginTop: 4, letterSpacing: ".04em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* floating terminal card */}
        <div className="float" style={{
          position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)",
          width: 340, background: C.surface, border: `1px solid ${C.borderBright}`,
          borderRadius: 14, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)",
          display: "none", // hidden on small, we'll use inline style override
        }} id="terminal-float">
          <div style={{ background: "#141620", padding: "10px 14px", display: "flex", gap: 6, alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
            {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// How it works</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>
            Three resources.<br />One workflow.
          </h2>
          <p style={{ color: C.muted, maxWidth: "50ch", fontSize: "1rem", lineHeight: 1.7, marginBottom: 60, fontWeight: 300 }}>
            Users register items, community members post about found objects, and admins manage the entire lifecycle through a clean REST interface.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                step: "01", icon: "📝", color: C.amber,
                title: "Report",
                desc: "A student loses an item and POSTs it to /products with category, location, and status='lost'. The item enters the system immediately.",
                code: `POST /products\n{\n  "title": "AirPods",\n  "category": "Electronics",\n  "location": "info",\n  "status": "lost",\n  "user_id": 12\n}`,
              },
              {
                step: "02", icon: "🔍", color: C.teal,
                title: "Discover",
                desc: "Staff or another student finds the item and updates status to 'found', setting found_by to their user ID. A post is created to notify the community.",
                code: `PUT /products/5\n{ "status": "found", "found_by": 7 }\n\nPOST /posts\n{\n  "user_id": 7,\n  "product_id": 5,\n  "title": "Found AirPods"\n}`,
              },
              {
                step: "03", icon: "✅", color: C.purple,
                title: "Claim",
                desc: "The original owner identifies their item and the admin marks it 'claimed'. The lifecycle is complete. All history is preserved.",
                code: `PUT /products/5\n{\n  "status": "claimed"\n}\n\n// 200 OK\n{\n  "message": "Product updated"\n}`,
              },
            ].map(({ step, icon, color, title, desc, code }) => (
              <div key={step} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "24px 24px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: ".68rem",
                      color, border: `1px solid`, borderColor: color,
                      padding: "2px 8px", borderRadius: 100, opacity: .7,
                    }}>{step}</span>
                    <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{title}</h3>
                  </div>
                  <p style={{ color: C.muted, fontSize: ".88rem", lineHeight: 1.65, marginBottom: 20 }}>{desc}</p>
                </div>
                <pre style={{
                  background: "#070809", margin: "0 16px 16px",
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "14px 16px", fontSize: ".68rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#a3e635", lineHeight: 1.6, overflow: "hidden",
                }}>{code}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API DOCS ──────────────────────────────────────────────────────── */}
      <section id="api" ref={docsRef} style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// API Reference</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 8 }}>
            Full endpoint docs
          </h2>
          <p style={{ color: C.muted, marginBottom: 12, fontWeight: 300 }}>
            Base URL: <code style={{ fontFamily: "'JetBrains Mono', monospace", color: C.amber, background: "#1e2028", padding: "2px 8px", borderRadius: 6, fontSize: ".85rem" }}>{BASE}</code>
          </p>
          <p style={{ color: C.muted, fontSize: ".85rem", marginBottom: 44, fontWeight: 300 }}>Click any endpoint to expand request/response details and a ready-to-use cURL command.</p>

          {/* group tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {API_GROUPS.map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)}
                style={{
                  padding: "9px 22px", borderRadius: 100, fontSize: ".85rem", fontWeight: 500,
                  border: `1px solid`, cursor: "pointer", transition: "all .2s",
                  background: activeGroup === g.key ? g.color : "transparent",
                  color: activeGroup === g.key ? "#000" : C.muted,
                  borderColor: activeGroup === g.key ? g.color : C.border,
                }}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>

          {/* group header */}
          {group && (
            <>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 24px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: "1.8rem" }}>{group.emoji}</span>
                <div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>{group.label}</p>
                  <p style={{ color: C.muted, fontSize: ".85rem", marginTop: 2 }}>{group.desc}</p>
                </div>
                <span style={{ marginLeft: "auto", background: "#1e2028", color: C.muted, fontSize: ".75rem", fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: 100 }}>
                  {group.endpoints.length} endpoints
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.endpoints.map((ep, i) => (
                  <EndpointCard key={i} ep={ep} baseUrl={BASE} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── SCHEMA ───────────────────────────────────────────────────────── */}
      <section id="schema" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// Database Schema</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 48 }}>
            MySQL 8 tables
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {SCHEMA.map(({ table, color, fields }) => (
              <div key={table} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: ".9rem", color }}>
                    {table}
                  </span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {fields.map(f => (
                    <div key={f.name} style={{ display: "flex", justifyContent: "space-between", padding: "7px 20px", gap: 12 }}
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

          {/* Constraints */}
          <div style={{ marginTop: 32, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>Check Constraints</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "users_chk_1", clause: "role IN ('user', 'admin')" },
                { name: "users_chk_2", clause: "department IN ('math', 'sm', 'info', 'st')" },
                { name: "products_chk_1", clause: "category IN ('Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sport', 'Books', 'Other')" },
                { name: "products_chk_2", clause: "status IN ('lost', 'found', 'claimed')" },
                { name: "products_chk_3", clause: "location IN ('info', 'sm', 'st', 'math')" },
              ].map(c => (
                <div key={c.name} style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.purple, minWidth: 150 }}>{c.name}</code>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.muted }}>{c.clause}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────────────────── */}
      <section id="stack" style={{ padding: "100px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem", color: C.amber, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>// Built with</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 48 }}>
            Tech stack
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
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

          {/* Architecture diagram */}
          <div style={{ marginTop: 48, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "32px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 32 }}>Architecture</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Client / React Admin", color: C.amber },
                { label: "→", color: C.faint },
                { label: "Express.js", color: C.teal },
                { label: "→", color: C.faint },
                { label: "MySQL Pool", color: C.purple },
                { label: "→", color: C.faint },
                { label: "MySQL 8 DB", color: "#60a5fa" },
              ].map((item, i) => (
                <div key={i}>
                  {item.label === "→"
                    ? <span style={{ color: C.faint, fontSize: "1.2rem" }}>→</span>
                    : <div style={{
                        border: `1px solid`, borderColor: item.color,
                        borderRadius: 8, padding: "8px 18px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: ".78rem", color: item.color,
                        background: `${item.color}0d`,
                      }}>{item.label}</div>
                  }
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Router: /products", color: C.amber },
                { label: "Router: /users", color: C.purple },
                { label: "Router: /posts", color: C.teal },
              ].map(r => (
                <span key={r.label} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem",
                  color: r.color, background: `${r.color}12`,
                  border: `1px solid ${r.color}30`, borderRadius: 6, padding: "4px 12px",
                }}>{r.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK START ──────────────────────────────────────────────────── */}
      <section style={{ padding: "80px max(6vw, 24px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>
            Start in 30 seconds
          </h2>
          <p style={{ color: C.muted, marginBottom: 36, fontWeight: 300 }}>No auth required. Hit the live API directly.</p>
          <div style={{ background: "#070809", border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 28px", textAlign: "left", position: "relative" }}>
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <CopyBtn text={`# Get all lost items\ncurl ${BASE}/products\n\n# Get all users\ncurl ${BASE}/users\n\n# Get all posts with user and product details\ncurl ${BASE}/posts`} />
            </div>
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".82rem", color: "#67e8f9", lineHeight: 1.8 }}>
{`# Get all lost items
curl ${BASE}/products

# Get all users
curl ${BASE}/users

# Get all posts with user and product details
curl ${BASE}/posts`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px max(6vw, 24px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, ${C.amber}, #ef4444)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#000",
          }}>T</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".95rem" }}>twedrli</span>
          <span style={{ color: C.faint, fontSize: ".8rem" }}>— Lost & Found Platform</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <a href={`${BASE}`} target="_blank" rel="noreferrer"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.muted, textDecoration: "none" }}>
            API ↗
          </a>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: C.faint }}>
            Univ. Abu Baker Belkaid · Tlemcen, DZ
          </span>
          <span style={{ color: C.faint, fontSize: ".75rem" }}>·</span>
          <span style={{ fontSize: ".82rem", color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
            Powered by{" "}
            <a
              href="https://www.linkedin.com/in/issam-kebdani-8b6154334"
              target="_blank"
              rel="noreferrer"
              style={{
                color: C.amber,
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "opacity .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Issam Kebdani
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}