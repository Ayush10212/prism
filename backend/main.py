from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.decision import router as decision_router
from api.auth import router as auth_router
from api.payments import router as payments_router

from database import init_db

app = FastAPI(title="PRISM - Decision Intelligence API")

@app.on_event("startup")
def on_startup():
    init_db()

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(payments_router, prefix="/api/payments", tags=["payments"])
app.include_router(decision_router, prefix="/api", tags=["decisions"])

@app.get("/")
async def root():
    return {"message": "PRISM API operational", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
