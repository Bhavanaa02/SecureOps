"use client";

import { useState } from "react";

import {
  BrainCircuit,
  ChevronRight,
  Code,
  Shield,
  Zap,
} from "lucide-react";


interface Suggestion {

  title: string;

  file: string;

  line: number;

  snippet: string;

  fix: string;

}


export function AIAdvisor({
  suggestions = [],
}: {
  suggestions?: Suggestion[];
}) {


  const [
    expandedId,
    setExpandedId,
  ] =
    useState<
      number | null
    >(0);



  if (
    !suggestions ||
    suggestions.length === 0
  ) {

    return (

      <div className="rounded-2xl p-6 bg-white/5 border border-white/10">

        <h3 className="text-lg font-semibold text-cyan-400">
          AI Security Advisor
        </h3>

        <p className="text-gray-400 mt-4">
          No vulnerabilities detected.
        </p>

      </div>

    );

  }



  return (

    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">


      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">

          <BrainCircuit className="w-5 h-5 text-cyan-400" />

        </div>


        <div>

          <h3 className="text-lg font-semibold">
            AI Security Advisor
          </h3>

          <p className="text-xs text-gray-400">
            Intelligent remediation guidance
          </p>

        </div>


        <div className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">

          <Zap className="w-3 h-3" />

          Active

        </div>

      </div>



      {/* ITEMS */}
      <div className="space-y-3">

        {suggestions.map(
          (
            rec,
            index
          ) => (

            <div
              key={index}
              className="rounded-xl border-l-4 border-red-500 bg-red-500/5"
            >


              {/* HEADER */}
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId ===
                      index
                      ? null
                      : index
                  )
                }
                className="w-full p-4 flex items-start gap-3 text-left"
              >

                <Shield className="w-5 h-5 text-red-400 mt-1" />


                <div className="flex-1">

                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-red-500/20 text-red-400">

                    detected

                  </span>


                  <p className="mt-2 text-sm font-medium">

                    {
                      rec.title
                    }

                  </p>

                </div>


                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    expandedId ===
                    index
                      ? "rotate-90"
                      : ""
                  }`}
                />

              </button>



              {/* BODY */}
              {expandedId ===
                index && (

                <div className="px-4 pb-4 pl-12 space-y-4">


                  <p className="text-sm">

                    <span className="text-cyan-400">
                      File:
                    </span>{" "}

                    {
                      rec.file
                    }

                  </p>


                  <p className="text-sm">

                    <span className="text-cyan-400">
                      Line:
                    </span>{" "}

                    {
                      rec.line
                    }

                  </p>



                  {/* Vulnerable Code */}
                  <div className="rounded-lg bg-black/30 border border-white/10">

                    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">

                      <Code className="w-4 h-4 text-red-400" />

                      <span className="text-xs">
                        Vulnerable Code
                      </span>

                    </div>


                    <pre className="p-3 text-xs text-red-300 whitespace-pre-wrap">

                      {
                        rec.snippet
                      }

                    </pre>

                  </div>



                  {/* Fix */}
                  <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20">

                    <div className="px-3 py-2 border-b border-cyan-500/20">

                      <span className="text-xs text-cyan-400">
                        Recommended Fix
                      </span>

                    </div>


                    <pre className="p-3 text-xs whitespace-pre-wrap">

                      {
                        rec.fix
                      }

                    </pre>

                  </div>

                </div>

              )}

            </div>

          )
        )}

      </div>

    </div>

  );

}