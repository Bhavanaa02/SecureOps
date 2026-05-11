"use client";

import { useEffect, useState } from "react";

export function SettingsPanel() {

  const [darkMode, setDarkMode] =
    useState(true);

  const [reportFormat, setReportFormat] =
    useState("PDF");


  /* =========================
     LOAD SETTINGS
  ========================= */

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "secureops-settings"
      );


    if (saved) {

      const parsed =
        JSON.parse(
          saved
        );


      setDarkMode(
        parsed.darkMode ?? true
      );


      setReportFormat(
        parsed.reportFormat ?? "PDF"
      );

    }

  }, []);




  /* =========================
     APPLY SETTINGS
  ========================= */

  useEffect(() => {

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );


    localStorage.setItem(

      "secureops-settings",

      JSON.stringify({

        darkMode,
        reportFormat,

      })

    );

  }, [

    darkMode,
    reportFormat,

  ]);



  return (

    <div className="space-y-6 max-w-4xl">

      <h2 className="text-3xl font-bold text-cyan-400">
        Settings
      </h2>



      <div className="grid md:grid-cols-2 gap-6">


        {/* Theme */}

        <div className="glow-card p-6 rounded-2xl">

          <h3 className="font-semibold mb-5">
            Appearance
          </h3>


          <div className="flex justify-between">

            <span>
              Dark Mode
            </span>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) =>
                setDarkMode(
                  e.target.checked
                )
              }
            />

          </div>

        </div>




        {/* Reports */}

        <div className="glow-card p-6 rounded-2xl">

          <h3 className="font-semibold mb-5">
            Default Report
          </h3>


          <select

            value={reportFormat}

            onChange={(e) =>
              setReportFormat(
                e.target.value
              )
            }

            className="
              bg-black
              border
              rounded-lg
              px-3
              py-2
              w-full
            "

          >

            <option>
              PDF
            </option>

            <option>
              JSON
            </option>

            <option>
              HTML
            </option>

          </select>

        </div>


      </div>

    </div>

  );

}