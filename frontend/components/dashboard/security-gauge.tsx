"use client";

import { useEffect, useState } from "react";

import {
  Github,
  Shield,
  Activity,
  AlertTriangle,
  Globe,
  FileCode,
} from "lucide-react";


interface SecurityGaugeProps {

  score: number;

  scanTime: string;

  totalIssues: number;

  sourceType: string;

  repoName: string;

}


export function SecurityGauge({

  score,

  scanTime,

  totalIssues,

  sourceType,

  repoName,

}: SecurityGaugeProps) {


  const [
    animatedScore,
    setAnimatedScore,
  ] =
    useState(0);



  const safeScore =

  Math.max(
    0,

    Math.min(
      100,

      Number(
        score ?? 100
      )

    )

  );



  useEffect(() => {

    setAnimatedScore(
      safeScore
    );

  }, [safeScore]);



  const radius =
    90;



  const circumference =

    2 *

    Math.PI *

    radius;



  const offset =

    circumference -

    (
      animatedScore /
      100
    ) *

    circumference;



  // FIXED STATUS LOGIC
  const getStatus =
    () => {

      if (
        totalIssues === 0
      ) {

        return {

          text:
            "SECURE",

          color:
            "#22c55e",

          textColor:
            "text-green-400",

          glow:
            "rgba(34,197,94,0.3)",

        };

      }



      if (
        safeScore < 50
      ) {

        return {

          text:
            "HIGH",

          color:
            "#f97316",

          textColor:
            "text-orange-400",

          glow:
            "rgba(249,115,22,0.3)",

        };

      }



      return {

        text:
          "MODERATE",

          color:
            "#06b6d4",

          textColor:
            "text-cyan-400",

          glow:
            "rgba(6,182,212,0.3)",

        };

    };



  const getScanSource =
    () => {

      const type =

        sourceType
          ?.toLowerCase()
          ?.trim();



      if (

        type.includes(
          "github"
        ) ||

        type.includes(
          "repository"
        )

      ) {

        return {

          text:
            "GitHub Repository",

          icon:
            Github,

        };

      }



      if (

        type.includes(
          "website"
        ) ||

        type.includes(
          "url"
        )

      ) {

        return {

          text:
            "Website URL",

          icon:
            Globe,

        };

      }



      if (

        type.includes(
          "file"
        )

      ) {

        return {

          text:
            "Uploaded File",

          icon:
            FileCode,

        };

      }



      return {

        text:
          repoName ||
          "Unknown",

        icon:
          FileCode,

      };

    };



  const status =
    getStatus();



  const source =
    getScanSource();



  const SourceIcon =
    source.icon;



  return (

    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">


      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h3 className="text-lg font-semibold">

          Security Score

        </h3>


        <div className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">

          LIVE

        </div>

      </div>



      {/* GAUGE */}
      <div className="flex justify-center">

        <div className="relative w-56 h-56">


          <div
            className="absolute inset-6 rounded-full blur-2xl opacity-40"
            style={{
              background:
                status.glow,
            }}
          />


          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 200 200"
          >

            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />


            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={
                status.color
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                offset
              }
              style={{
                transition:
                  "stroke-dashoffset 1s ease",
                filter:
                  `drop-shadow(0 0 12px ${status.glow})`,
              }}
            />

          </svg>



          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-5xl font-bold">

              {
                animatedScore
              }

            </span>


            <span className="text-xs text-gray-400 mt-1">

              out of 100

            </span>


            <span
              className={`mt-3 text-sm font-bold ${status.textColor}`}
            >

              {
                status.text
              }

            </span>

          </div>

        </div>

      </div>



      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 mt-8">


        <div className="bg-black/20 rounded-xl p-4">

          <SourceIcon className="w-4 h-4 text-cyan-400 mb-2" />

          <p className="text-xs text-gray-400">

            Scan Source

          </p>


          <p className="text-sm font-medium text-cyan-400 truncate">

            {
              source.text
            }

          </p>

        </div>



        <div className="bg-black/20 rounded-xl p-4">

          <AlertTriangle className="w-4 h-4 text-cyan-400 mb-2" />

          <p className="text-xs text-gray-400">

            Total Issues

          </p>


          <p className="text-sm font-medium">

            {
              totalIssues
            }

          </p>

        </div>



        <div className="bg-black/20 rounded-xl p-4">

          <Activity className="w-4 h-4 text-cyan-400 mb-2" />

          <p className="text-xs text-gray-400">

            Scan Status

          </p>


          <p className="text-sm font-medium">

            Completed

          </p>

        </div>



        <div className="bg-black/20 rounded-xl p-4">

          <Shield className="w-4 h-4 text-cyan-400 mb-2" />

          <p className="text-xs text-gray-400">

            Last Scan

          </p>


          <p className="text-sm font-medium">

            {
              scanTime
            }

          </p>

        </div>

      </div>

    </div>

  );

}