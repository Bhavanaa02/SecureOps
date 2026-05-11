"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  CheckCircle,
  ChevronDown,
} from "lucide-react";


interface Finding {

  severity: string;

  file: string;

  line: number;

  issue: string;

}


interface ScannerCardProps {

  title: string;

  tool: string;

  icon: React.ReactNode;

  vulnerabilities: {

    critical: number;

    high: number;

    medium: number;

    low: number;

  };

  findings?: Finding[];

  lastScan: string;

  status:
    | "running"
    | "complete"
    | "failed";

}


export function ScannerCard({

  title,

  tool,

  icon,

  vulnerabilities,

  findings = [],

  lastScan,

}: ScannerCardProps) {


  const [
    selectedSeverity,
    setSelectedSeverity,
  ] =
    useState<
      string | null
    >(null);



  const safeVuln =
    vulnerabilities || {

      critical: 0,

      high: 0,

      medium: 0,

      low: 0,

    };



  const filteredFindings =

    !selectedSeverity

      ? []

      : findings.filter(
          (
            item
          ) => {

            const severity =

              item
                ?.severity
                ?.toLowerCase()
                ?.trim();


            return (

              severity ===

              selectedSeverity
                .toLowerCase()
                .trim()

            );

          }
        );



  const total =

    safeVuln.critical +

    safeVuln.high +

    safeVuln.medium +

    safeVuln.low;



  const SeverityBox = (

    severity: string,

    count: number,

    color: string

  ) => (

    <button

      onClick={() =>

        setSelectedSeverity(

          selectedSeverity ===
            severity

            ? null

            : severity

        )

      }

      className={cn(

        "text-center p-2 rounded-lg border",

        color

      )}

    >

      <span className="text-lg font-bold">

        {count}

      </span>


      <p className="text-[10px] mt-1">

        {severity}

      </p>

    </button>

  );



  return (

    <div className="rounded-2xl p-5 bg-white/5 border border-white/10 space-y-5">


      {/* HEADER */}
      <div className="flex justify-between">

        <div className="flex gap-3">

          <div className="text-cyan-400">

            {icon}

          </div>


          <div>

            <h4 className="font-semibold">

              {title}

            </h4>


            <p className="text-xs text-gray-400">

              {tool}

            </p>

          </div>

        </div>



        <CheckCircle
          className="text-green-400"
          size={18}
        />

      </div>



      {/* TOTAL */}
      <div className="text-center">

        <h1 className="text-4xl font-bold">

          {total}

        </h1>


        <p className="text-sm text-gray-400">

          Total Issues

        </p>

      </div>



      {/* SEVERITY */}
      <div className="grid grid-cols-4 gap-2">


        {SeverityBox(

          "critical",

          safeVuln.critical,

          "bg-red-500/10 border-red-500/20 text-red-400"

        )}


        {SeverityBox(

          "high",

          safeVuln.high,

          "bg-orange-500/10 border-orange-500/20 text-orange-400"

        )}


        {SeverityBox(

          "medium",

          safeVuln.medium,

          "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"

        )}


        {SeverityBox(

          "low",

          safeVuln.low,

          "bg-blue-500/10 border-blue-500/20 text-blue-400"

        )}

      </div>



      {/* FINDINGS */}
      {selectedSeverity && (

        <div className="space-y-3 border-t border-white/10 pt-4">


          <div className="flex items-center gap-2">

            <ChevronDown
              size={16}
            />

            <p className="text-sm font-medium capitalize">

              {
                selectedSeverity
              } findings

            </p>

          </div>



          {filteredFindings.length ===
          0 ? (

            <p className="text-sm text-gray-400">

              No findings.

            </p>

          ) : (

            filteredFindings.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="bg-black/20 rounded-xl p-4"
                >

                  <p className="text-cyan-400 text-sm">

                    {
                      item.file
                    }

                  </p>


                  <p className="text-xs text-gray-400 mt-1">

                    Line:

                    {" "}

                    {
                      item.line
                    }

                  </p>


                  <p className="text-sm mt-2">

                    {
                      item.issue
                    }

                  </p>

                </div>

              )
            )

          )}

        </div>

      )}



      {/* FOOTER */}
      <p className="text-xs text-gray-400 text-center">

        Last Scan:

        {" "}

        {
          lastScan
        }

      </p>

    </div>

  );

}