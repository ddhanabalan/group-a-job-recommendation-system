from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


origins = [
    "*",
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://localhost:5500",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/skills")
async def get_skills(q: Optional[str]=None):
    df = pd.read_csv("app/data/skills/2.csv")
    df = df.dropna(subset=['Skill Name'])
    df = df[['Skill Name','Skill Category']]# Remove duplicate entries
    print(df)
    if q is not None:
        df = df[df.str.lower().str.startswith(q.lower())]
    return df[:100].to_dict(orient="records")
