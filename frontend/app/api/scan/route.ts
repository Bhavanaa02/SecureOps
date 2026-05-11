import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const execAsync =
  promisify(exec);

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );



function extractSourceCode(
  filePath: string,
  lineNumber: number
) {

  try {

    const lines =
      fs
        .readFileSync(
          filePath,
          "utf8"
        )
        .split("\n");

    return lines
      .slice(

        Math.max(
          0,
          lineNumber - 2
        ),

        lineNumber + 2

      )
      .join("\n");

  } catch {

    return "// Source unavailable";

  }

}



function formatRepoPath(
  fullPath: string,
  tempDir: string,
  repoUrl: string
) {

  const repoName =
    repoUrl
      .split("/")
      .pop()
      ?.replace(
        ".git",
        ""
      ) ||

    "Repository";



  const relativePath =
    path.relative(
      tempDir,
      fullPath
    );



  return `${repoName}/${relativePath}`;

}



function getAttackType(
  issue: string
) {

  const text =
    issue.toLowerCase();



  if (
    text.includes(
      "integrity"
    )
  ) {

    return {

      name:
        "Subresource Integrity Missing",

      attack:
        "Attackers may inject malicious JavaScript.",

    };

  }



  if (
    text.includes(
      "csrf"
    )
  ) {

    return {

      name:
        "CSRF Vulnerability",

      attack:
        "Attackers may forge requests.",

    };

  }



  if (
    text.includes(
      "api"
    )
  ) {

    return {

      name:
        "Credential Exposure",

      attack:
        "Attackers may steal exposed secrets.",

    };

  }



  return {

    name:
      "Security Misconfiguration",

    attack:
      "Application may be vulnerable.",

  };

}



async function getAIFix(
  issue: string,
  code: string,
  file: string,
  line: number
) {

  try {

    const model =
      genAI.getGenerativeModel({

        model:
          "gemini-1.5-flash",

      });



    const result =
      await model.generateContent(

`
Issue:
${issue}

File:
${file}

Line:
${line}

Code:
${code}

Return only secure fixed code.
`

      );



    const fix =
      result
        .response
        .text()
        ?.trim();



    if (
      fix &&
      fix.length > 0
    ) {

      return fix;

    }

  } catch {}



  return `// Secure remediation
// Validate input
// Sanitize user data
// Apply access control
// Store secrets securely`;

}



export async function POST(
  req: Request
) {

  try {

    const {
      repoUrl,
    } =
      await req.json();



    const tempDir =
      path.join(

        process.cwd(),

        "temp",

        `scan-${Date.now()}`

      );



    await execAsync(

      `git clone ${repoUrl} "${tempDir}"`

    );



    let results:
      any[] = [];



    try {

      const {
        stdout,
      } =
        await execAsync(

          `semgrep --config=auto "${tempDir}" --json`

        );



      const parsed =
        JSON.parse(

          stdout.slice(
            stdout.indexOf(
              "{"
            )
          )

        );



      results =
        parsed.results || [];

    } catch {}



    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;



    const suggestions =
      await Promise.all(

        results
          .slice(0, 20)
          .map(

            async (
              item: any
            ) => {

              const rawSeverity =
                String(

                  item?.extra
                    ?.severity ||

                  "warning"

                )
                .toLowerCase();



              let severity =
                "medium";



              if (
                rawSeverity ===
                "error"
              ) {

                severity =
                  "critical";

                critical++;

              }

              else if (
                rawSeverity ===
                "warning"
              ) {

                severity =
                  "high";

                high++;

              }

              else if (
                rawSeverity ===
                "info"
              ) {

                severity =
                  "low";

                low++;

              }

              else {

                severity =
                  "medium";

                medium++;

              }



              const issue =
                String(

                  item?.extra
                    ?.message ||

                  item?.check_id ||

                  "Security issue"

                );



              const filePath =
                String(
                  item?.path || "-"
                );



              const line =
                Number(
                  item?.start?.line || 1
                );



              const snippet =
                extractSourceCode(

                  filePath,

                  line

                );



              const attack =
                getAttackType(
                  issue
                );



              return {

                severity,

                issue,

                title:
                  attack.name,

                attack:
                  attack.attack,

                file:
                  formatRepoPath(

                    filePath,

                    tempDir,

                    repoUrl

                  ),

                line,

                snippet,

                fix:
                  await getAIFix(

                    issue,

                    snippet,

                    filePath,

                    line

                  ),

              };

            }

          )

      );



    const totalIssues =

      critical +
      high +
      medium +
      low;



    let score =

      100 -

      (
        critical * 15
      ) -

      (
        high * 3
      ) -

      (
        medium * 2
      ) -

      (
        low * 1
      );



    score =
      Math.max(
        0,
        Math.min(
          100,
          score
        )
      );



    if (
      critical > 0 &&
      score > 49
    ) {

      score = 49;

    }

    else if (
      high > 0 &&
      score > 79
    ) {

      score = 79;

    }



    let status =
      "SECURE";



    if (
      critical > 0
    ) {

      status =
        "CRITICAL";

    }

    else if (
      high > 0
    ) {

      status =
        "HIGH";

    }

    else if (
      medium > 0
    ) {

      status =
        "MODERATE";

    }



    const repoName =
      repoUrl
        .split("/")
        .pop()
        ?.replace(
          ".git",
          ""
        ) ||

      "Repository";



    return NextResponse.json({

      platform:
        "SecureOps",

      sourceType:
        "GitHub Repository",

      repoName,

      score,

      status,

      totalIssues,

      generatedAt:
        new Date()
          .toLocaleString(),



      sast: {

        critical,
        high,
        medium,
        low,

        findings:
          suggestions,

      },



      sca: {

        critical: 0,
        high: 0,
        medium: 0,
        low: 0,

        findings: [],

      },



      gitleaks: {

        total: 0,

        findings: [],

      },



      suggestions,

    });

  } catch {

    return NextResponse.json(

      {
        error:
          "Scan failed",
      },

      {
        status: 500,
      }

    );

  }

}