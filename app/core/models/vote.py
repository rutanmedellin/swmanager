from django.db import models
from django.contrib.auth.models import User
from django.forms.models import model_to_dict


# Ugliest model ever just for time reasosns and bad front-end design :(
# TODO Change me!!: User real relations instead of ids for example.
class Vote(models.Model):
    "Geniric vote model"
    user = models.ForeignKey(User, related_name='votes', null=True, blank=True)
    type_id = models.CharField(max_length=255)
    vote_type = models.CharField(max_length=64)

    def __unicode__(self):
        return str(model_to_dict(self))
    
    class Meta:
        app_label = 'core'
        verbose_name_plural = 'Vote'
        
