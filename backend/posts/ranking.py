from datetime import timezone
from math import pow

def calculate_hot_score(score, created_at):
    age_hours = (timezone.now() - created_at).total_seconds() / 3600
    return score / pow(age_hours + 2, 1.5)
