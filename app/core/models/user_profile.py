from django.db import models
from django.contrib.auth.models import User, Permission, Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

#from django_mongodb_engine.contrib import MongoDBManager
#from djangotoolbox.fields import ListField, DictField

from tastypie.models import create_api_key

from activation.models import Activation, Invitation
from activation.signals import activation_created
from activation.signals import invitation_created
from activation.signals import invitation_accepted

import logging
log = logging.getLogger(__name__)


class UserProfileManager(models.Manager):

    def sign_up(self, username, email, password, invitation=None):
        " Signup an user to the system."

        user = User.objects.create_user(username, email, password)
        if invitation:
            invitation.accept(user)
        return user


class UserProfile(models.Model):
    " Profile of an user."
    
    user = models.ForeignKey(User)

    #: Is a public profile.
    is_public = models.BooleanField("Public", default=True)

    #: Custom Objects.
    objects = UserProfileManager()

    class Meta(object):
        app_label = 'core'
        verbose_name_plural = 'User Profiles'


#: Signals

#: Create apikey for each user_profile created
models.signals.post_save.connect(create_api_key, sender=User)


#: Create a user_profile for each user created
@receiver(post_save, sender=User, dispatch_uid='create_profile')
def create_profile(sender, instance, created, **kwargs):
    " Create an user profile after an user is created."
    
    if created:
        log.debug("Create an user profile for user: %s" % (instance.email, ))
        UserProfile.objects.create(user=instance)


#: Activation signals
#TODO: add expiration invitation signal to django-activation
@receiver(invitation_created, sender=Invitation, dispatch_uid='send_invitation_key')
def send_invitation_key(sender, invitation, **kwargs):
    print "######## Invitation key: %s" % invitation.key


@receiver(invitation_accepted, sender=Invitation, dispatch_uid='add_role')
def add_role(sender, invitation, user, **kwargs):
    if isinstance(invitation.to, Group):
        user.groups.add(invitation.to)
        user.save()
        print "###### %s added to %s :)" % (user, invitation.to)
