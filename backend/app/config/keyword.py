SEARCH_KEYWORDS = [
    "today",
    "yesterday",
    "last night",
    "latest",
    "current",
    "news",
    "weather",
    "score",
    "match",
    "ipl",
    "stock",
    "bitcoin",
    "version"
]

def keyword_search(msg: str) -> bool:
    return any(
        keyword in msg.lower()
        for keyword in SEARCH_KEYWORDS
    )