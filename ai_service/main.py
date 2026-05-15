from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from services.face_hash import compute_face_hash, compute_face_embedding
from services.sentiment import analyze_sentiment

app = FastAPI(
    title="GovFeedback AI Service",
    description="Photo hashing, face embedding, and sentiment analysis for GovFeedback Hub 1.0 PRO",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "GovFeedback AI"}


@app.post("/analyze")
async def analyze(
    text: str = Form(...),
    photo: Optional[UploadFile] = File(None)
):
    """
    Main endpoint: accepts feedback text + optional photo.
    Returns sentiment analysis + face hash + face embedding.
    """
    result = {}

    # --- Sentiment Analysis ---
    sentiment_result = analyze_sentiment(text)
    result.update(sentiment_result)

    # --- Face Hashing ---
    if photo:
        photo_bytes = await photo.read()
        face_hash = compute_face_hash(photo_bytes)
        face_embedding = compute_face_embedding(photo_bytes)
        result["face_hash"] = face_hash
        result["face_embedding"] = face_embedding
        result["photo_size_kb"] = round(len(photo_bytes) / 1024, 1)
    else:
        result["face_hash"] = None
        result["face_embedding"] = []

    return result


@app.post("/hash-photo")
async def hash_photo(photo: UploadFile = File(...)):
    """Standalone endpoint to hash a photo only."""
    photo_bytes = await photo.read()
    face_hash = compute_face_hash(photo_bytes)
    face_embedding = compute_face_embedding(photo_bytes)
    return {"face_hash": face_hash, "face_embedding": face_embedding}


@app.post("/sentiment")
async def sentiment(text: str = Form(...)):
    """Standalone endpoint for sentiment analysis only."""
    return analyze_sentiment(text)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
