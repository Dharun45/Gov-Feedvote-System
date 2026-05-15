import hashlib
import io
import numpy as np
from PIL import Image

def compute_face_hash(image_bytes: bytes) -> str:
    """
    Compute a perceptual hash of an image for identity verification.
    Uses SHA256 of a normalized, downsampled grayscale image so similar
    faces produce similar hashes (more stable than raw SHA256).
    For production use a real face embedding model (e.g. DeepFace, InsightFace).
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("L")  # Grayscale
        img = img.resize((64, 64), Image.LANCZOS)               # Normalize size
        arr = np.array(img)
        
        # Average hash (pHash-style) — stable perceptual fingerprint
        mean = arr.mean()
        bits = (arr > mean).flatten().astype(int)
        bit_string = ''.join(map(str, bits))
        
        # SHA256 of the bit string
        face_hash = hashlib.sha256(bit_string.encode()).hexdigest()
        return face_hash
    except Exception as e:
        # Fallback to raw SHA256 of file bytes
        return hashlib.sha256(image_bytes).hexdigest()


def compute_face_embedding(image_bytes: bytes) -> list:
    """
    Compute a simplified image embedding vector for similarity comparison.
    In production, replace with a real face recognition model.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = img.resize((16, 16), Image.LANCZOS)
        arr = np.array(img, dtype=np.float32) / 255.0
        embedding = arr.flatten().tolist()
        return embedding
    except:
        return []


def check_duplicate(embedding: list, stored_embeddings: list, threshold: float = 0.95) -> bool:
    """
    Compare new face embedding with stored ones using cosine similarity.
    Returns True if a match above `threshold` is found.
    """
    if not embedding or not stored_embeddings:
        return False
    
    vec = np.array(embedding)
    for stored in stored_embeddings:
        stored_vec = np.array(stored)
        if len(vec) != len(stored_vec):
            continue
        similarity = np.dot(vec, stored_vec) / (np.linalg.norm(vec) * np.linalg.norm(stored_vec) + 1e-10)
        if similarity > threshold:
            return True
    return False
