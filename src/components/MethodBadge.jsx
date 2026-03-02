import { METHOD_STYLE } from "../constants";

export default function MethodBadge({ method }) {
  const s = METHOD_STYLE[method] || METHOD_STYLE.GET;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      className="text-xs font-bold px-2 py-0.5 rounded font-mono tracking-wide">
      {method}
    </span>
  );
}