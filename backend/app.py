from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess, os, json, tempfile, requests, zipfile

app = Flask(__name__)
CORS(app)

# ----------------------------
# HELPERS
# ----------------------------
def default_counts():
    return {"critical": 0, "high": 0, "medium": 0, "low": 0}

def safe_run(func, *args):
    try:
        return func(*args)
    except Exception as e:
        return {"error": str(e), **default_counts()}

def detect_input(target, url):
    if url:
        return "url"
    if target.startswith("http"):
        return "repo"
    if os.path.exists(target):
        return "folder"
    return "unknown"

def clone_repo(repo):
    temp = tempfile.mkdtemp()
    subprocess.run(["git", "clone", repo, temp], capture_output=True)
    return temp

def extract_zip(file_path):
    extract_dir = tempfile.mkdtemp()
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    return extract_dir

# ----------------------------
# TOOLS
# ----------------------------
def run_trivy(target):
    try:
        result = subprocess.run(
            ["trivy", "fs", "--format", "json", target],
            capture_output=True, text=True
        )
        data = json.loads(result.stdout or "{}")

        c=h=m=l=0
        for r in data.get("Results", []):
            for v in r.get("Vulnerabilities", []):
                sev=v.get("Severity")
                if sev=="CRITICAL": c+=1
                elif sev=="HIGH": h+=1
                elif sev=="MEDIUM": m+=1
                elif sev=="LOW": l+=1

        return {"critical":c,"high":h,"medium":m,"low":l}
    except:
        return default_counts()

def run_gitleaks(target):
    try:
        result = subprocess.run(
            ["gitleaks", "detect", "--source", target, "--report-format", "json"],
            capture_output=True, text=True
        )
        leaks = json.loads(result.stdout or "[]")
        return {"critical":len(leaks),"high":0,"medium":0,"low":0}
    except:
        return default_counts()

def run_zap(url):
    try:
        res = requests.get(f"http://127.0.0.1:8080/JSON/core/view/alerts/?baseurl={url}")
        alerts = res.json().get("alerts", [])
        h=m=l=0
        for a in alerts:
            if a["risk"]=="High": h+=1
            elif a["risk"]=="Medium": m+=1
            elif a["risk"]=="Low": l+=1
        return {"critical":0,"high":h,"medium":m,"low":l}
    except:
        return default_counts()

# ----------------------------
# AI ADVISOR
# ----------------------------
def generate_advice(results):
    advice=[]
    if "Gitleaks" in results and results["Gitleaks"]["critical"]>0:
        advice.append({"title":"Secrets Found","fix":"Move secrets to env variables"})
    if "Trivy" in results and results["Trivy"]["critical"]>0:
        advice.append({"title":"Vulnerable Dependencies","fix":"Update packages"})
    if "DAST" in results and results["DAST"]["high"]>0:
        advice.append({"title":"Web Vulnerabilities","fix":"Validate inputs"})
    if not advice:
        advice.append({"title":"Secure","fix":"No major issues"})
    return advice

def score(results):
    total=0
    for r in results.values():
        total+=r["critical"]*5+r["high"]*3+r["medium"]*2+r["low"]
    return max(0,100-total)

# ----------------------------
# API
# ----------------------------
@app.route("/run-scan", methods=["POST"])
def scan():
    logs=[]
    target=""
    url=""

    if request.files:
        file=request.files["file"]
        path=os.path.join(tempfile.gettempdir(),file.filename)
        file.save(path)
        target=extract_zip(path)
        logs.append("File uploaded & extracted")

    else:
        data=request.json
        target=data.get("target","")
        url=data.get("url","")

    input_type=detect_input(target,url)
    results={}

    logs.append(f"Detected: {input_type}")

    if input_type=="url":
        logs.append("Running ZAP")
        results["DAST"]=safe_run(run_zap,url)

    else:
        if input_type=="repo":
            logs.append("Cloning repo")
            target=clone_repo(target)

        logs.append("Running Trivy")
        results["Trivy"]=safe_run(run_trivy,target)

        logs.append("Running Gitleaks")
        results["Gitleaks"]=safe_run(run_gitleaks,target)

    return jsonify({
        "score":score(results),
        "tools":list(results.keys()),
        "logs":logs,
        "advice":generate_advice(results),
        **results
    })

if __name__=="__main__":
    app.run(debug=True)