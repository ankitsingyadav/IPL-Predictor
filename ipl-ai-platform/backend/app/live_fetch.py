import requests
import os
from dotenv import load_dotenv
from time import time

load_dotenv()

API_KEY = os.getenv("CRIC_API_KEY")

# 🔥 CACHE
LAST_FETCH_TIME = 0
CACHED_DATA = None


def fetch_live():
    global LAST_FETCH_TIME, CACHED_DATA

    now = time()

    # ⏳ Use cache if called within 60 sec
    if CACHED_DATA and (now - LAST_FETCH_TIME < 60):
        print("⚡ Using cached data")
        return CACHED_DATA

    try:
        url = f"https://api.cricapi.com/v1/currentMatches?apikey={API_KEY}&offset=0"
        res = requests.get(url, timeout=5)
        data = res.json()

        print("API RESPONSE:", data)

        # ❌ If API blocked or failed
        if data.get("status") == "failure":
            print("❌ API BLOCKED / LIMIT HIT")
            return CACHED_DATA

        for match in data.get("data", []):
            status = match.get("status", "")
            started = match.get("matchStarted", False)

            # 🔥 LIVE DETECTION
            if started or "live" in status.lower() or "progress" in status.lower():

                teams = match.get("teams", [])
                score_data = match.get("score", [])

                team1 = teams[0] if len(teams) > 0 else "Team A"
                team2 = teams[1] if len(teams) > 1 else "Team B"

                if score_data:
                    s = score_data[0]
                    score = f"{s.get('r', 0)}/{s.get('w', 0)} ({s.get('o', 0)})"
                else:
                    score = "Match Started"

                result = {
                    "team1": team1,
                    "team2": team2,
                    "score": score,
                    "status": "LIVE",
                    "matchStarted": True
                }

                # 🔥 SAVE CACHE
                CACHED_DATA = result
                LAST_FETCH_TIME = now

                print("🔥 LIVE MATCH FOUND")

                return result

        print("❌ NO LIVE MATCH FOUND")
        return CACHED_DATA

    except Exception as e:
        print("❌ ERROR:", e)
        return CACHED_DATA