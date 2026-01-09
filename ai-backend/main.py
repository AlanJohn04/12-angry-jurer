# from fastapi import FastAPI
# from pydantic import BaseModel
# from analyzer import analyze

# app = FastAPI()

# class ConflictInput(BaseModel):
#     textA: str
#     textB: str

# @app.post("/analyze")
# def analyze_conflict(data: ConflictInput):
#     result = analyze(data.textA, data.textB)
#     return result





from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze

app = FastAPI()

# 🔥 CORS CONFIG (THIS FIXES YOUR ERROR)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConflictInput(BaseModel):
    textA: str
    textB: str

@app.post("/analyze")
def analyze_conflict(data: ConflictInput):
    result = analyze(data.textA, data.textB)
    return result
