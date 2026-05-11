"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import {
  Code,
  Package,
  Key,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

import { SecurityGauge } from "@/components/dashboard/security-gauge";
import { ScannerCard } from "@/components/dashboard/scanner-card";
import { AIAdvisor } from "@/components/dashboard/ai-advisor";


export default function ResultDashboard() {

  const router =
    useRouter();

  const [data, setData] =
    useState<any>(
      null
    );

  const [
    activeItem,
    setActiveItem,
  ] =
    useState(
      "Overview"
    );



  useEffect(() => {

    const stored =
      localStorage.getItem(
        "scanResult"
      );


    if (
      !stored
    ) {

      router.push(
        "/dashboard"
      );

      return;

    }


    try {

      const parsed =
        JSON.parse(
          stored
        );


      parsed.scanTime =
        new Date()
          .toLocaleTimeString();


      setData(
        parsed
      );

    } catch {

      localStorage.removeItem(
        "scanResult"
      );

      router.push(
        "/dashboard"
      );

    }

  }, [router]);



  if (!data) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading scan results...

      </div>

    );

  }



  const sast =
    data?.sast;


  const sca =
    data?.sca;


  const totalIssues =

    (
      data?.sast
        ?.findings
        ?.length || 0
    ) +

    (
      data?.sca
        ?.findings
        ?.length || 0
    ) +

    (
      data?.gitleaks
        ?.findings
        ?.length || 0
    );



  return (

    <div className="min-h-screen bg-black text-white">

      <Sidebar
        activeItem={
          activeItem
        }
        setActiveItem={
          setActiveItem
        }
      />


      <div className="ml-64 p-8">


        {/* BACK */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-all"
          >
            <ChevronLeft size={16} />
            <span>Back to Scan</span>
          </button>
        </div>



        {/* OVERVIEW */}
        {activeItem ===
          "Overview" && (

            <SecurityGauge

              score={
                data?.score || 0
              }

              scanTime={
                data?.scanTime ||
                "Just now"
              }

              sourceType={
                data?.sourceType ||
                "unknown"
              }

              repoName={
                data?.repoName ||
                "Repository"
              }

              totalIssues={
                totalIssues
              }

            />

          )}



        {/* SAST */}
        {activeItem ===
          "SAST Analysis" && (

            <ScannerCard

              title="SAST Analysis"

              tool="Semgrep"

              icon={<Code />}

              vulnerabilities={
                sast
              }

              findings={
                sast?.findings ||
                []
              }

              lastScan={
                data?.scanTime
              }

              status={
                "complete"
              }

            />

          )}



        {/* SCA */}
        {activeItem ===
          "SCA Check" && (

            <ScannerCard

              title="SCA Check"

              tool="npm audit"

              icon={
                <Package />
              }

              vulnerabilities={
                sca
              }

              findings={
                sca?.findings ||
                []
              }

              lastScan={
                data?.scanTime
              }

              status={
                "complete"
              }

            />

          )}



        {/* SECRETS */}
        {activeItem ===
          "Secrets Scan" && (

            <ScannerCard

              title="Secrets Scan"

              tool="Gitleaks"

              icon={<Key />}

              vulnerabilities={{

                critical:
                  data?.gitleaks
                    ?.total || 0,

                high: 0,

                medium: 0,

                low: 0,

              }}

              findings={
                data?.gitleaks
                  ?.findings ||
                []
              }

              lastScan={
                data?.scanTime
              }

              status={
                "complete"
              }

            />

          )}



        {/* AI */}
        {activeItem ===
          "AI Advisory" && (

            <AIAdvisor
              suggestions={
                data?.suggestions ||
                []
              }
            />

          )}

        {/* REPORTS */}
        {/* REPORTS */}
        {activeItem ===
          "Reports" && (

            <div className="space-y-8">

              <h1 className="text-3xl font-bold text-cyan-400">
                Security Reports
              </h1>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                {/* PDF */}
                <button

                  onClick={() => {

                    const html =
                      `
<html>
<head>
<title>SecureOps Report</title>
</head>

<body style="font-family: Arial; padding:40px;">

<h1>SecureOps Security Report</h1>

<hr/>

<h2>Repository</h2>
<p>${data.repoName}</p>

<h2>Security Score</h2>
<p>${data.score}/100</p>

<h2>Total Issues</h2>
<p>${totalIssues}</p>

<h2>SAST Issues</h2>
<p>${data?.sast?.findings?.length || 0}</p>

<h2>SCA Issues</h2>
<p>${data?.sca?.findings?.length || 0}</p>

<h2>Secrets Found</h2>
<p>${data?.gitleaks?.findings?.length || 0}</p>

</body>
</html>
`;


                    const win =
                      window.open(
                        "",
                        "_blank"
                      );


                    if (win) {

                      win.document.write(
                        html
                      );

                      win.document.close();

                      win.print();

                    }

                  }}

                  className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                >

                  Export PDF

                </button>





                {/* JSON */}
                <button

                  onClick={() => {

                    const blob =
                      new Blob(

                        [
                          JSON.stringify(
                            {

                              repository:
                                data.repoName,

                              score:
                                data.score,

                              totalIssues,

                              sast:
                                data.sast,

                              sca:
                                data.sca,

                              secrets:
                                data.gitleaks,

                              ai:
                                data.suggestions,

                            },

                            null,

                            2

                          ),
                        ],

                        {
                          type:
                            "application/json",
                        }

                      );


                    const url =
                      URL.createObjectURL(
                        blob
                      );


                    const a =
                      document.createElement(
                        "a"
                      );


                    a.href =
                      url;


                    a.download =
                      "secureops-report.json";


                    a.click();

                  }}

                  className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                >

                  Export JSON

                </button>





                {/* SHARE */}
                <button

                  onClick={() => {

                    const shareText =
                      `SecureOps Security Report

Repository: ${data.repoName || data.url || "Scanned Repository" }

Security Score: ${data.score || 0}/100

Total Issues: ${totalIssues}
`;


                    navigator.clipboard.writeText(

                      shareText

                    );


                    alert(
                      "Report copied"
                    );

                  }}

                  className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
                >

                  Share Report

                </button>


              </div>

            </div>

          )}



        {/* SETTINGS */}
        {activeItem ===
          "Settings" && (

            <SettingsPanel />

          )}

      </div>

    </div>

  );

}