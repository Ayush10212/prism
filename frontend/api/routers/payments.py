from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import User
from pydantic import BaseModel
import uuid

router = APIRouter()

class PaymentRequest(BaseModel):
    user_id: int
    amount: float
    currency: str # "USD" or "INR"
    method: str # "STRIPE" or "RAZORPAY"

@router.post("/process")
async def process_payment(request: PaymentRequest, db: Session = Depends(get_db)):
    # Mocking payment success
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Simulate gateway processing
    transaction_id = str(uuid.uuid4())
    
    # Update user status to PREMIUM
    user.subscription_status = "PREMIUM"
    user.currency_pref = request.currency
    db.commit()
    
    return {
        "status": "success",
        "transaction_id": transaction_id,
        "amount": request.amount,
        "currency": request.currency,
        "tier": "PREMIUM"
    }
