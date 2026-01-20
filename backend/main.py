from fastapi import FastAPI, HTTPException
from models import DecisionInput, DecisionOutput
from agent import run_decision_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DecideForMe")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for demo / assessment
    allow_credentials=True,
    allow_methods=["*"],  # <-- THIS fixes OPTIONS
    allow_headers=["*"],
)

@app.post("/decide", response_model=DecisionOutput)
async def decide(input: DecisionInput):
    try:
        return await run_decision_agent(input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
