from pydantic import BaseModel
from typing import List, Optional, Literal

class DecisionInput(BaseModel):
    decision: str
    options: List[str]
    constraints: Optional[List[str]] = None
    urgency: Literal["low", "medium", "high"]

class DecisionOutput(BaseModel):
    recommendation: str
    reasoning: str
    tradeoffs: List[str]
    fallback_plan: str
    confidence_score: int
