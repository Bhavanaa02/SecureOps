"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
});

export default function Dashboard() {

  const router = useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [repo, setRepo] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [scanning, setScanning] =
    useState(false);

  const [open, setOpen] =
    useState(false);



  /* =========================
     LOAD USER
  ========================= */

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "user"
      );

      router.push("/");

    };



  /* =========================
     SCAN
  ========================= */

  const handleScan =
    async () => {

      if (
        !repo &&
        !url &&
        !file
      ) {

        alert(
          "Enter repo / url / file"
        );

        return;

      }


      setScanning(
        true
      );


      const inputValue =
        repo ||
        url ||
        file?.name ||
        "";


      const res =
        await fetch(
          "/api/scan",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  repoUrl:
                    inputValue,
                }
              ),
          }
        );


      const data =
        await res.json();



      const scanResult = {

        ...data,


        repoUrl:
          repo ||
          null,


        websiteUrl:
          url ||
          null,


        fileName:
          file?.name ||
          null,


        sourceType:
          repo
            ? "github"
            : url
            ? "website"
            : file
            ? "file"
            : "unknown",

      };



      setTimeout(
        () => {

          localStorage.setItem(

            "scanResult",

            JSON.stringify(
              scanResult
            )

          );


          setScanning(
            false
          );


          router.push(
            "/dashboard/result"
          );

        },

        2000

      );

    };



  return (

    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white`}>


      {/* PROFILE */}
      <div className="flex justify-end p-6 relative">

        <div
          onClick={() =>
            setOpen(
              !open
            )
          }
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20"
        >

          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">

            {
              user?.name?.[0] ||
              "U"
            }

          </div>


          <span>

            {
              user?.name ||
              "User"
            }

          </span>

        </div>



        {/* DROPDOWN */}
        {open && (

          <div className="absolute top-16 right-6 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3">

            <p className="text-sm mb-2">

              {
                user?.email
              }

            </p>



            <button
              onClick={() =>
                router.push(
                  "/profile"
                )
              }
              className="block w-full text-left py-2 hover:text-cyan-400"
            >

              Profile

            </button>



            <button
              onClick={
                handleLogout
              }
              className="block w-full text-left py-2 text-red-400"
            >

              Logout

            </button>

          </div>

        )}

      </div>



      {/* TITLE */}
      <div className="text-center mt-10">

        <h1 className="text-5xl font-bold text-cyan-400">

          SecureOps

        </h1>


        <p className="text-gray-400 mt-3">

          Automated Security Analysis Platform

        </p>


        <p className="text-cyan-500 text-sm mt-2">

          Semgrep • npm audit • Gitleaks

        </p>

      </div>



      {/* INPUT */}
      {!scanning && (

        <div className="mt-12 flex justify-center">

          <div className="w-full max-w-2xl p-10 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.08)] space-y-6">


            <input
              placeholder="Enter GitHub Repository URL"
              value={repo}
              onChange={(
                e
              ) =>
                setRepo(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-xl bg-black/40 border border-cyan-400/20"
            />


            <input
              placeholder="Enter Target Website URL"
              value={url}
              onChange={(
                e
              ) =>
                setUrl(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-xl bg-black/40 border border-blue-400/20"
            />


            <input
              type="file"
              onChange={(
                e
              ) =>
                setFile(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
            />


            <button
              onClick={
                handleScan
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
            >

              Run Security Scan

            </button>

          </div>

        </div>

      )}



      {/* LOADER */}
      {scanning && (

        <div className="flex flex-col items-center justify-center mt-24">


          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-cyan-500 border-opacity-50 mb-6" />


          <h2 className="text-2xl font-semibold text-white">

            Security Analysis in Progress

          </h2>


          <p className="text-gray-400 mt-2">

            Running Security tools

          </p>


          <button
            onClick={() => setScanning(false)}
            className="mt-6 text-red-400 hover:text-red-300 transition font medium"
          >

            Cancel

          </button>

        </div>

      )}

    </div>

  );

}