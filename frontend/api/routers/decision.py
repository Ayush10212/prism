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

@router.post("/analyze")
async def analyze(request: DecisionRequest, db: Session = Depends(get_db)):
    try:
        analysis = await engine.analyze_decision(db, request.dict())
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
