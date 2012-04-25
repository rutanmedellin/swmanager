import logging

from django.db import models
from django.contrib.auth.models import User


class Session(models.Model):
    
    user = models.ForeignKey(User, related_name='sessions')
    token = models.CharField(max_length=256, blank=True, default='')
    
    class Meta:
        verbose_name_plural = 'Sessions'
        app_label = 'core'
