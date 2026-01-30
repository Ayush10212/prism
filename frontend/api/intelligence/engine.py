from models.schemas import Decision, BehaviorPattern
from sqlalchemy.orm import Session
import datetime

class PrismIntelligenceEngine:
    def __init__(self):
        pass

    async def analyze_decision(self, db: Session, decision_data: dict):
        """
        Executes the 8-step Decision Analysis Pipeline with RAG retrieval.
        """
        # Retrieve Memory context (Simplified RAG)
        past_decisions = db.query(Decision).filter(Decision.asset == decision_data['asset']).limit(5).all()
        
        # Detect Biases based on history
        detected_biases = []
        if len(past_decisions) > 2:
            detected_biases.append("Recency Bias / Overtrading suspected in this asset.")

        # Logic for analysis
        analysis = {
            "summary": f"Analyzing {decision_data['action']} decision for {decision_data['asset']}.",
            "assumptions": ["Market trend will persist", "Liquidity remains stable"],
            "biases": detected_biases if detected_biases else ["Neutral behavioral state detected."],
            "risks": ["Volatility expansion invalidates short-term stops.", "Macro headwinds not accounted for."],
            "scenarios": {
                "bull": "Continuation to target. Trigger: Break of nearest resistance.",
                "base": "Range-bound consolidation.",
                "bear": "Invalidation of support levels. Liquidation risk."
            },
            "score": 75 - (15 * len(detected_biases)),
            "guidance": "Verify volume confirmation before increasing exposure." if not detected_biases else "Symmetry of reasoning is low. HIGH RISK DETECTED.",
            "prompt": "What is the one macro event that makes this entire setup irrelevant?"
        }

        # Persist Decision
        new_decision = Decision(
            asset=decision_data['asset'],
            action=decision_data['action'],
            reasoning=decision_data['reasoning'],
            timeframe=decision_data['timeframe'],
            conviction_level=decision_data['conviction'],
            user_id=decision_data.get('user_id'),
            emotional_tone="Neutral"
        )
        db.add(new_decision)
        db.commit()

        return analysis

engine = PrismIntelligenceEngine()
