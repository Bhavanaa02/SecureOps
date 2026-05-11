"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScan = async () => {
    if (!repoUrl) return alert("Enter repo URL");


    setLoading(true);

    const res = await fetch("/api/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    });

    const data = await res.json();
    localStorage.setItem("scanResult", JSON.stringify(data));
    router.push("/dashboard/result");

    setLoading(false);


  };

  return (
    <div className="p-10 text-white">
      <input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter repo URL"
        className="p-3 border bg-black"
      />
      <button onClick={handleScan} className="ml-3 px-4 py-2 bg-cyan-500">
        {loading ? "Scanning..." : "Scan"}
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-6 left-6 px-3 py-1 rounded-1g bg-white/10 hover:bg-white/20"
      >
      ← Back 
      </button>
    </div>
  );
}