import requests
import os

API_KEY = os.getenv("CRIC_API_KEY")

def fetch_scorecard():
    try:
        url = f"https://api.cricapi.com/v1/currentMatches?apikey={API_KEY}&offset=0"
        res = requests.get(url)
        data = res.json()

        for match in data.get("data", []):
            if "IPL" in match.get("name", ""):
                return match  # full data

        return None

    except Exception as e:
        print(e)
        return None