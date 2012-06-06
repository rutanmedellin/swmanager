from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    owner = models.ForeignKey(User, related_name='my_project')
    name = models.CharField(max_length=512)
    description = models.TextField()
    twitter = models.CharField(max_length=128, default="")
    url = models.URLField(default="")
    image = models.URLField(default="")
    email = models.EmailField(default="")
    team = models.ManyToManyField(User, related_name='projects', blank=True, null=True)

    
    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Projects'
