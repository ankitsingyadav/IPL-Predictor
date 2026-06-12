from supabase import create_client
import os

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def log_prediction(match, prob):
    supabase.table("predictions").insert({
        "match": str(match),
        "probability": prob
    }).execute()