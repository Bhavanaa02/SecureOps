"use client";

import { useEffect, useState } from "react";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/history")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl mb-6">Scan History</h1>

      {data.map((item: any, i) => (
        <div key={i} className="p-4 bg-white/5 mb-3 rounded">
          {item.target} - Score: {item.score}
        </div>
      ))}
    </div>
  );
}