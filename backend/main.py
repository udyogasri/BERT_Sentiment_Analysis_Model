from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys

# Ensure root and src are in path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from src.predict import predict_sentiment
from src.config import MODEL_SAVE_PATH

app = FastAPI(title="BERT Sentiment Analysis API")

# Configure CORS so the React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestModel(BaseModel):
    text: str

@app.get("/")
def home():
    is_trained = os.path.exists(MODEL_SAVE_PATH) and len(os.listdir(MODEL_SAVE_PATH)) > 0
    return {
        "status": "online",
        "model_trained": is_trained,
        "message": "BERT Sentiment Analysis API is running!"
    }

@app.post("/predict")
def predict(request: RequestModel):
    is_trained = os.path.exists(MODEL_SAVE_PATH) and len(os.listdir(MODEL_SAVE_PATH)) > 0
    if not is_trained:
        raise HTTPException(
            status_code=400,
            detail="Model is not trained yet. Please run training first (python src/train.py)."
        )
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    try:
        sentiment, confidence = predict_sentiment(request.text)
        return {
            "text": request.text,
            "sentiment": sentiment,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
