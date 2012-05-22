from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    name = models.CharField(max_length=512)
    description = models.TextField()
    url = models.URLField()
    email = models.EmailField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Events'
