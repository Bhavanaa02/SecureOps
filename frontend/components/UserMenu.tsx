"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function UserMenu() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    if (!session) return null;

    return (
        <div className="relative">
            <img
                src={session.user?.image || "/default-avatar.png"}
                className="w-10 h-10 rounded-full cursor-pointer border border-white/20"
                onClick={() => setOpen(!open)}
            />


            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-black border border-white/10 rounded-xl p-3">

                    <div className="mb-3 border-b border-white/10 pb-2">
                        <p className="text-sm font-semibold">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                    </div>

                    <button className="w-full text-left text-sm hover:text-cyan-400 mb-2">
                        Profile
                    </button>

                    <button
                        onClick={() => signOut()}
                        className="w-full text-left text-sm text-red-400"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>

    );
}