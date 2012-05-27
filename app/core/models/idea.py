from django.db import models
from django.contrib.auth.models import User

#from django_mongodb_engine.contrib import MongoDBManager

import logging
log = logging.getLogger(__name__)


class Idea(models.Model):
    "A participant owns an idea that could be a future project"

    participant = models.ForeignKey(User, related_name='idea', null=True)
    name = models.CharField(max_length = 512)
    description = models.TextField()

    #   objects = MongoDBManager()
    
    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Ideas'
    
