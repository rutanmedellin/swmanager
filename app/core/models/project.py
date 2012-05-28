from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    owner = models.ForeignKey(User, related_name='project')
    name = models.CharField(max_length=512)
    description = models.TextField()

    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Projects'
