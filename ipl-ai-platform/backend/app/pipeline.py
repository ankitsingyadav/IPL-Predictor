import os
import datetime

def run_pipeline():
    print("Running pipeline...")
    os.system("python train.py")

    with open("log.txt", "a") as f:
        f.write(f"Pipeline ran at {datetime.datetime.now()}\n")

if __name__ == "__main__":
    run_pipeline()