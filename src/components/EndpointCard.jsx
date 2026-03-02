import { useState } from "react";
import { C } from "../constants";
import MethodBadge from "./MethodBadge";
import CopyBtn from "./CopyBtn";

export default function EndpointCard({ ep, baseUrl }) {
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

      {/* ── Header ── */}
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", width: "100%", textAlign: "left", flexWrap: "wrap" }}>
        <MethodBadge method={ep.method} />
        <span className="font-mono text-sm" style={{ color: C.text }}>{ep.path}</span>
        <span className="text-sm" style={{ color: C.muted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ep.summary}
        </span>
        <span style={{ color: C.muted, fontSize: ".75rem", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Body ── */}
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }} className="px-5 py-4 space-y-4">
          <p className="text-sm" style={{ color: C.muted }}>{ep.desc}</p>

          {ep.params && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: C.faint }}>Path Params</p>
              <div className="space-y-1">
                {ep.params.map(p => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }} className="text-sm">
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
              <div className="rounded-lg overflow-x-auto" style={{ border: `1px solid ${C.border}` }}>
                <table className="w-full text-xs" style={{ minWidth: 480 }}>
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