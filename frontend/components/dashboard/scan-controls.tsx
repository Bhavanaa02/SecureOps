"use client";

import { useState } from "react";

export function ScanControls({ onResult }: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleScan = async () => {
    if (!input) return;

    setLoading(true);
    setStatus("Initializing scan...");

    try {

      setTimeout(() => setStatus("Running Gitleaks..."), 1000);
      setTimeout(() => setStatus("Running Dependency Check..."), 1500);
      setTimeout(() => setStatus("Running Semgrep..."), 2000);

      const res = await fetch("http://localhost:5000/run-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: input,
          url: "http://testphp.vulnweb.com",
        }),
      });

      const data = await res.json();

      setStatus("Completed ✅");
      onResult(data);

    } catch (err) {
      console.error(err);
      setStatus("Error occurred ❌");
    }

    setLoading(false);
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter project path"
          className="flex-1 px-4 py-2 bg-black border border-white/10 rounded-lg"
        />

        <button
          onClick={handleScan}
          disabled={loading}
          className="px-6 py-2 bg-cyan-500 rounded-lg disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      {/* 🔥 STATUS DISPLAY */}
      {loading && (
        <div className="text-sm text-cyan-400 animate-pulse">
          {status}
        </div>
      )}
    </div>
  );
}