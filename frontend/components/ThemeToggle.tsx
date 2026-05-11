"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [light, setLight] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("bg-white", !dark);
    document.body.classList.toggle("text-black", !dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-2 bg-white/10 rounded"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}