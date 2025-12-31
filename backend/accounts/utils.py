import random

ADJECTIVES = [
    "Silent", "Lonely", "Hidden", "Lost", "Dark", "Quiet", "Anonymous"
]

NOUNS = [
    "Raivaru", "Wave", "Soul", "Shadow", "Island", "Voice", "Coral"
]

def generate_pseudonym():
    return f"{random.choice(ADJECTIVES)}_{random.choice(NOUNS)}_{random.randint(1000,9999)}"
