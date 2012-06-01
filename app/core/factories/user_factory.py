import factory
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db.models import get_model


class UserFactory(factory.Factory):
    FACTORY_FOR = User

    @classmethod
    def _setup_next_sequence(cls):
        try:
            return cls._associated_class.objects.values_list(
                'id', flat=True).order_by('-id')[0] + 1
        except IndexError:
            return 0

    username = factory.Sequence(lambda n: "username%s" % n)
    email = "tmontana@scarface.com"
    password = 'sha1$f7b2d$6a42b767f4eb5ffdf3c29ba9776317ca7be53831' # 123
    userprofile__is_public = True
User.Factory = UserFactory


def user_create(cls, **kwargs):
    # figure out the profile's related name and strip profile's kwargs
    profile_model, profile_kwargs = None, {}
    try:
        app_label, model_name = settings.AUTH_PROFILE_MODULE.split('.')
    except (ValueError, AttributeError):
        pass
    else:
        try:
            profile_model = get_model(app_label, model_name)
        except (ImportError, ImproperlyConfigured):
            pass
    if profile_model:
        user_field = profile_model._meta.get_field_by_name('user')[0]
        related_name = user_field.related_query_name()
        profile_prefix = '%s__' % related_name
        print "profile_prefix: %s" % profile_prefix
        for k in kwargs.keys():
            if k.startswith(profile_prefix):
                profile_key = k.replace(profile_prefix, '', 1)
                profile_kwargs[profile_key] = kwargs.pop(k)

    # create the user
    user = cls._default_manager.create(**kwargs)
    print "profile_model: %s" % profile_model
    print "kwargs: %s" % profile_kwargs
    
    if profile_model and profile_kwargs:
        print "update or create: %s" % user
        # update or create the profile model
        profile, created = profile_model._default_manager.get_or_create(
            user=user, defaults=profile_kwargs)
        if not created:
            print "not created"
            for k, v in profile_kwargs.items():
                setattr(profile, k, v)
            profile.save()
        setattr(user, related_name, profile)
        setattr(user, '_profile_cache', profile)
    print "user: %s" % user
    return user
UserFactory.set_creation_function(user_create)


class ParticipantFactory(UserFactory):
    pass
