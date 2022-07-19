from django.db import models


class Industry(models.TextChoices):
    ARTS_AND_ENTERTAINMENT = "Arts & entertainment", "Arts & entertainment"
    COMMUNICATION_AND_EDUCATION = "Communication & education", "Communication & education"
    FOOD_AND_DRINK = "Food & drink", "Food & drink"
    HEALTH_AND_WELLNESS = "Health & wellness", "Health & wellness"
    LODGING = "Lodging", "Lodging"
    SHOPPING = "Shopping", "Shopping"
    SERVICES = "Services", "Services"
