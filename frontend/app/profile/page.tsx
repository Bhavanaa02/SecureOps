"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) return <p className="text-white p-10">Not logged in</p>;

  return (
          
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <button 
      onClick={() => router.back()}
      className="absolute top-6 left-6 px-3 py-1 rounded-1g bg-white/10 hover:bg-white/20"
    >
      ← Back 
    </button>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">

        {/* PROFILE IMAGE */}
        <img
          src={session.user?.image || "/default-avatar.png"}
          className="w-20 h-20 rounded-full mx-auto mb-4 border border-white/20"
        />

        <h1 className="text-xl font-semibold mb-1">
          {session.user?.name}
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          {session.user?.email}
        </p>

        {/* EXTRA INFO */}
        <div className="text-left space-y-2 text-sm">
          <p><span className="text-gray-400">Status:</span> Active</p>
          <p><span className="text-gray-400">Provider:</span> OAuth</p>
        </div>

      </div>
    </div>
    
  );
}