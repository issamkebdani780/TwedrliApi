import { useState } from "react";

export default function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button onClick={copy} className="text-xs px-2 py-1 rounded transition-colors"
      style={{ background: copied ? "#065f46" : "#1e2028", color: copied ? "#34d399" : "#9ca3af" }}>
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}