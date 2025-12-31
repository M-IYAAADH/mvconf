import hashlib
import os

SALT = os.getenv("IP_HASH_SALT", "dev-salt-change")

def hash_ip(ip_address: str) -> str:
    value = f"{ip_address}{SALT}"
    return hashlib.sha256(value.encode()).hexdigest()
