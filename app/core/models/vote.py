from django.db import models
from django.contrib.auth.models import User

# Ugliest model ever just for time reasosns and bad front-end design :(
# TODO Change me!!: User real relations instead of ids for example.
class Vote(models.Model):
    "Geniric vote model"
    user = models.ManyToManyField(User, related_name='votes')
    type_id = models.CharField(max_length=255)
    vote_type = models.CharField(max_length=64)
    
    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Vote'
