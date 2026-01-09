from transformers import pipeline

sentiment = pipeline("sentiment-analysis")

def analyze(text_a: str, text_b: str):
    sa = sentiment(text_a)[0]
    sb = sentiment(text_b)[0]

    emotions = []
    if sa["label"] == "NEGATIVE" or sb["label"] == "NEGATIVE":
        emotions.append("emotional tension")

    return {
        "summary": "Conflict caused by tone and expectation mismatch",
        "partyA_sentiment": sa,
        "partyB_sentiment": sb,
        "emotions": emotions,
        "resolution": "Both parties clarify intent and expectations calmly"
    }
