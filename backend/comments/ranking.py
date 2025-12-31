from django.utils import timezone
from math import pow


def calculate_comment_hot_score(score, created_at):
    """
    Calculate hot score for a comment using time-decay algorithm.
    Comments decay faster than posts to encourage fresh discussion.
    """
    age_hours = (timezone.now() - created_at).total_seconds() / 3600
    return score / pow(age_hours + 1.5, 1.3)
