from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.live_fetch import fetch_live
from app.scorecard import fetch_scorecard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "IPL Predictor API is running"}


# 🔴 LIVE MATCHES
@app.get("/matches")
def get_matches():
    live = fetch_live()

    if not live:
        return []  # frontend will fallback to demo

    # normalize data for frontend
    return [
        {
            "team1": live.get("team1"),
            "team2": live.get("team2"),
            "score": live.get("score"),
            "status": "LIVE",
            "matchStarted": True,
        }
    ]


# 📊 SCORECARD
@app.get("/scorecard")
def get_scorecard():
    data = fetch_scorecard()

    if not data:
        return {}

    return data