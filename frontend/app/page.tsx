"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ LOGIN (MongoDB)
  const handleContinue = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {

      // ✅ SAVE LOGGED-IN USER
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
        })
      );

      router.push("/dashboard");

    } else {
      alert(data.error || "Login failed");
    }
  };
  
  const checks = {
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[@$!%*?&]/.test(password),
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      <div className="absolute w-96 h-96 bg-cyan-500/10 blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500/10 blur-3xl bottom-10 right-10"></div>
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 blur-3xl rounded-full"></div>

      {/* 🔐 CARD */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2 text-cyan-200">
          SecureOps
        </h1>

        <p className="text-center text-sm text-gray-400 mb-6">
          Automated Security Analysis and Developer Guidance Platform
        </p>

        {/* SOCIAL LOGIN */}
        <div className="space-y-3">

          {/* GOOGLE */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* GITHUB */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/10 backdrop-blur-md hover:scale-[1.02]"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">Continue with GitHub</span>
          </button>

        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* INPUTS */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 mb-3 outline-none focus:border-cyan-400 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10 mb-4 outline-none focus:border-cyan-400 transition"
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleContinue}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition font-semibold shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        >
          Login
        </button>

        {/* SIGNUP REDIRECT */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}