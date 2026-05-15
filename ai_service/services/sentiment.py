import re

POSITIVE_WORDS = [
    "good", "great", "excellent", "amazing", "wonderful", "helpful", "efficient",
    "professional", "kind", "fast", "quick", "polite", "responsive", "best",
    "outstanding", "fantastic", "superb", "cooperative", "honest", "friendly",
]

NEGATIVE_WORDS = [
    "bad", "terrible", "awful", "poor", "horrible", "rude", "slow", "useless",
    "corrupt", "bribe", "worst", "unprofessional", "lazy", "delayed", "unfair",
    "negligent", "incompetent", "dishonest", "arrogant", "harassing",
]


def analyze_sentiment(text: str) -> dict:
    """
    Keyword-based sentiment analysis that returns a category and score (0-1).
    Score > 0.6 = Positive, < 0.4 = Negative, else Neutral.
    """
    if not text:
        return {"sentiment": "Neutral", "sentiment_score": 0.5}

    text_lower = text.lower()
    words = re.findall(r'\b\w+\b', text_lower)

    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)

    total = len(words) or 1
    score = 0.5 + (pos_count - neg_count) * 0.1

    # Clamp between 0.05 and 0.95
    score = max(0.05, min(0.95, score))

    if score > 0.6:
        sentiment = "Positive"
    elif score < 0.4:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {"sentiment": sentiment, "sentiment_score": round(score, 3)}
