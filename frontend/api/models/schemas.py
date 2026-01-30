from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    subscription_status = Column(String, default="FREEMIUM") # FREEMIUM, PREMIUM
    currency_pref = Column(String, default="USD")

    decisions = relationship("Decision", back_populates="user")

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    asset = Column(String, index=True)
    action = Column(String)  # Buy, Sell, Exit, Hold
    reasoning = Column(Text)
    timeframe = Column(String)
    conviction_level = Column(Integer)  # 1-10
    emotional_tone = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="decisions")
    outcomes = relationship("OutcomeLink", back_populates="decision")

class BehaviorPattern(Base):
    __tablename__ = "behavior_patterns"
    id = Column(Integer, primary_key=True, index=True)
    bias_name = Column(String, index=True) # FOMO, Loss Aversion, etc.
    frequency = Column(Integer, default=0)
    weight = Column(Float, default=0.0)
    meta_data = Column(JSON) # Detailed events or specifics
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class PsychologicalProfile(Base):
    __tablename__ = "psychological_profile"
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, unique=True, index=True) # Risk Tolerance, Stress Response, etc.
    value = Column(Float)
    history = Column(JSON) # Historical values for trend analysis
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class OutcomeLink(Base):
    __tablename__ = "outcome_links"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"))
    result = Column(String) # Success, Failure, Neutral
    delta = Column(Float) # PnL or quantitative outcome
    reflection = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    decision = relationship("Decision", back_populates="outcomes")
