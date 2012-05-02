from django.contrib.auth.models import User

from tastypie.resources import ModelResource
from tastypie.throttle import CacheThrottle
from tastypie.authorization import Authorization
from tastypie.validation import Validation
from tastypie import fields


from activation.models import Invitation

from core.models import UserProfile
from api.fields import ListField

class UserResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(UserResourceValidation, self).is_valid(bundle, request)
        
        if not bundle.data or 'invitation' not in bundle.data:
            return {'invitation': 'You need an invitation'}

        try:
            bundle.data['invitation'] = Invitation.objects.get(key=bundle.data['invitation'])
        except Invitation.DoesNotExist:
            errors['invitation'] = ["You get an invalid invitation. Contact support guys if you think we are wrong."]

        return errors


class UserResource(ModelResource):
#TODO: public user

    # Workaround for non-rel ListField
    roles = ListField()

    class Meta:
        queryset = User.objects.all()
        resource_name = 'users'
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        resource_uri_fieldname = 'username'
        allowed_methods = ['get', 'put', 'post']
        always_return_data = True
        throttle = CacheThrottle(throttle_at=200)
        validation = UserResourceValidation()
        authorization = Authorization()

    def obj_create(self, bundle, request=None, **kwargs):
        print "obj_create"
        self.is_valid(bundle, request=request)
        bundle.obj = UserProfile.objects.sign_up(username=bundle.data['username'],
                                                 email=bundle.data['email'],
                                                 password=bundle.data['password'],
                                                 invitation=bundle.data['invitation'])
        return bundle

    def dehydrate_roles(self, bundle):
        return bundle.obj.get_profile().roles
