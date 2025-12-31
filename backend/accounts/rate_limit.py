import time

RATE_LIMIT_STORE = {}

def is_rate_limited(key, limit=5, window=60):
    """
    key: unique identifier (anon user id)
    limit: max actions
    window: seconds
    """
    now = time.time()
    records = RATE_LIMIT_STORE.get(key, [])

    # Remove expired timestamps
    records = [t for t in records if now - t < window]

    if len(records) >= limit:
        return True

    records.append(now)
    RATE_LIMIT_STORE[key] = records
    return False
