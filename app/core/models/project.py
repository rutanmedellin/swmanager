from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    owner = models.ForeignKey(User, related_name='my_project')
    name = models.CharField(max_length=512)
    description = models.TextField()
    team = models.ManyToManyField(User, related_name='projects')
    
    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Projects'
