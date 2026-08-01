#!/usr/bin/env python3
"""
GSC URL inspection + sitemap resubmission for kimjooin.com.

Usage:
  python3 gsc_inspect.py               # inspect default URLs
  python3 gsc_inspect.py --submit      # resubmit sitemap only
  python3 gsc_inspect.py --all         # inspect + resubmit sitemap
  python3 gsc_inspect.py <url>         # inspect a single URL
"""

import sys
from datetime import datetime

SERVICE_ACCOUNT_FILE = "/Users/suhyun/Downloads/Projects/ethereal-mind-334915-eacc97d82a46.json"
SITE_URL = "sc-domain:kimjooin.com"
SITEMAP_URL = "https://kimjooin.com/sitemap.xml"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]

URLS = [
    # CMS pages — titles updated, schema added, now in sitemap
    "https://kimjooin.com/Module/CMS/CMS_Srno_39851.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39852.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39853.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39856.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39858.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39864.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39867.html",
    "https://kimjooin.com/Module/CMS/CMS_Srno_39860.html",
    # Doctor profile + homepage
    "https://kimjooin.com/Module/CMS/CMS_Srno_39849.html",
    "https://kimjooin.com/",
]

VERDICT_LABEL = {
    "PASS": "INDEXED",
    "NEUTRAL": "NEUTRAL",
    "FAIL": "NOT INDEXED",
    "VERDICT_UNSPECIFIED": "UNKNOWN",
}

def submit_sitemap(service):
    try:
        service.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"Sitemap resubmitted: {SITEMAP_URL}\n")
    except Exception as e:
        print(f"Sitemap submit failed: {e}\n")

def inspect(service, url):
    try:
        result = service.urlInspection().index().inspect(
            body={"inspectionUrl": url, "siteUrl": SITE_URL}
        ).execute()
        r = result.get("inspectionResult", {})
        idx = r.get("indexStatusResult", {})
        verdict = idx.get("verdict", "VERDICT_UNSPECIFIED")
        coverage = idx.get("coverageState", "Unknown")
        last_crawl = idx.get("lastCrawlTime", "")[:10] if idx.get("lastCrawlTime") else "—"
        return {
            "url": url,
            "verdict": verdict,
            "coverage": coverage,
            "last_crawl": last_crawl,
        }
    except Exception as e:
        return {"url": url, "verdict": "ERROR", "coverage": str(e)[:80], "last_crawl": "—"}

def main():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("searchconsole", "v1", credentials=creds)

    args = sys.argv[1:]
    do_submit = "--submit" in args or "--all" in args
    do_inspect = "--submit" not in args

    if do_submit:
        submit_sitemap(service)

    if do_inspect:
        urls = [a for a in args if a.startswith("http")] or URLS
        print(f"{'URL':<65} {'Status':<14} {'Coverage':<38} {'Last Crawl'}")
        print("-" * 135)
        for url in urls:
            r = inspect(service, url)
            label = VERDICT_LABEL.get(r["verdict"], r["verdict"])
            short = url.replace("https://kimjooin.com", "")
            print(f"{short:<65} {label:<14} {r['coverage']:<38} {r['last_crawl']}")
        print()

if __name__ == "__main__":
    main()
