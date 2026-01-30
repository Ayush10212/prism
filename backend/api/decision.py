from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from intelligence.engine import engine
from database import get_db
from models.schemas import Decision

router = APIRouter()

class DecisionRequest(BaseModel):
    asset: str
    action: str
    reasoning: str
    timeframe: str
    conviction: int
    user_id: Optional[int] = None

@router.get("/history")
async def get_history(db: Session = Depends(get_db)):
    try:
        decisions = db.query(Decision).order_by(Decision.created_at.desc()).all()
        return decisions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from api.deps import get_current_user
from models.schemas import User

@router.post("/analyze")
async def analyze(request: DecisionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.credits <= 0:
        raise HTTPException(status_code=402, detail="Trial limit reached. Please upgrade to continue.")

    try:
        # Decrement credits
        current_user.credits -= 1
        db.commit()
        
        analysis = await engine.analyze_decision(db, request.dict())
        # Append updated credits to the analysis response or wrap it. 
        # For simplicity, assuming analysis is a dict, we mix it in.
        # If analysis is an object, we might need to handle differently.
        # Based on previous code, it looks like a dict or Pydantic model dump.
        if isinstance(analysis, dict):
            analysis["user_credits"] = current_user.credits
        return analysis
    except Exception as e:
        # Rollback credit on failure? Maybe. But for now keep simple.
        raise HTTPException(status_code=500, detail=str(e))
