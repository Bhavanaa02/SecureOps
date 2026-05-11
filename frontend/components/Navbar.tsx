"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // 🔥 Dynamic name
    const name =
        session?.user?.name ||
        session?.user?.email?.split("@")[0] ||
        "User";

    return (
        <div className="flex justify-end p-4 relative">


            {/* USER BUTTON */}
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-1 rounded-lg hover:bg-white/10"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    {name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <span>{name}</span>
            </div>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute top-14 right-4 w-48 bg-black border border-white/10 rounded-xl shadow-lg p-2">

                    <button
                        onClick={() => {
                            router.push("/profile");
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded"
                    >
                        👤 Profile
                    </button>

                    <button
                        onClick={() => {
                            router.push("/history");
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded"
                    >
                        📜 History
                    </button>

                    <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/10 rounded"
                    >
                        🚪 Logout
                    </button>

                </div>
            )}
        </div>


    );
}