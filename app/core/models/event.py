from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    name = models.CharField(max_length=512)
    description = models.TextField()
    streaming_url = models.URLField(default="")
    cover = models.URLField(default="")
    twitter = models.CharField(max_length=128, default="")
    url = models.URLField()
    email = models.EmailField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Events'
