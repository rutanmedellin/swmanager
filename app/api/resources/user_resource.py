from django.contrib.auth.models import User
from django.db.models import Q

from tastypie.resources import ModelResource
from tastypie.throttle import CacheThrottle
from tastypie.authorization import Authorization
from tastypie.validation import Validation
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.models import ApiKey
from tastypie import fields
from tastypie.constants import ALL


from activation.models import Invitation

from core.models import UserProfile

import logging
log = logging.getLogger(__name__)


class UserResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(UserResourceValidation, self).is_valid(bundle, request)

        if request and request.method == 'PUT':
            if 'old_password' in bundle.data:
                old_password = bundle.data.get('old_password')
                if not bundle.obj.check_password(old_password):
                    errors['old_password'] = ["Forgot your password?"]
                
            return errors
        
        if not bundle.data or 'code' not in bundle.data:
            return {'code': 'You need an invitation code'}

        try:
            bundle.data['invitation'] = Invitation.objects.get(key=bundle.data['code'])
        except Invitation.DoesNotExist:
            errors['code'] = ["You get an invalid invitation. Contact support guys if you think we are wrong."]

        return errors


class UserResource(ModelResource):
    #TODO: public user

    #role = fields.ToManyField(GroupResource, attribute='groups')

    
    class Meta:
        queryset = User.objects.all()
        resource_name = 'users'
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        resource_uri_fieldname = 'username'
        allowed_methods = ['get', 'put', 'post', 'delete']
        always_return_data = True
        throttle = CacheThrottle(throttle_at=200)
        validation = UserResourceValidation()
        authorization = Authorization()

        filtering = {"first_name": ALL,
                     "last_name": ALL,
                     'role': ALL_WITH_RELATIONS,
                     'id': ALL}

    def obj_create(self, bundle, request=None, **kwargs):
        print "obj_create"
        self.is_valid(bundle, request=request)

        if bundle.errors:
            self.error_response(bundle.errors, request)
        
        bundle.obj = UserProfile.objects.sign_up(username=bundle.data['email'],
                                                 email=bundle.data['email'],
                                                 password=bundle.data['password'],
                                                 invitation=bundle.data['invitation'])
        if not bundle.obj:
            bundle.errors['email'] = 'Already taken'
            self.error_response(bundle.errors, request)
        
        return bundle


    def obj_update(self, bundle, request=None, skip_errors=False, **kwargs):
        bundle = super(UserResource, self).obj_update(bundle, request, skip_errors, **kwargs)
        try:
            profile = bundle.obj.get_profile()
            profile.twitter = bundle.data.get('twitter', profile.twitter)
            profile.bio = bundle.data.get('bio', profile.bio)
            profile.participant_type = bundle.data.get('participant_type', profile.participant_type)
            profile.save()
        except UserProfile.DoesNotExist:
            pass

        if 'password' in bundle.data and 'old_password' in bundle.data:
            bundle.obj.set_password(bundle.data.get('password'))
            bundle.obj.save() # FIXME: Too much saves
        
        return bundle
    

    def apply_filters(self, request, applicable_filters):
        base_object_list = super(UserResource, self).apply_filters(
            request, applicable_filters)

        #: Query filter
        q = request.GET.get('q', None)
        if q:
            qset = (
                Q(first_name__icontains=q) |
                Q(last_name__icontains=q) |
                Q(username__icontains=q) |
                Q(email__icontains=q)
                )
            base_object_list = base_object_list.filter(qset).distinct()

        #: Role filter
        role = request.GET.get('role', None)
        if role:
            qset = Q(groups__name=role)
            base_object_list = base_object_list.filter(qset)

        #: Participant type
        ptype = request.GET.get('participant_type', None)
        if ptype:
            qset = Q(userprofile__participant_type=ptype)
            base_object_list = base_object_list.filter(qset)

        return base_object_list

    def dehydrate(self, bundle):
        # Here i set stuff the client needs but are outside the user model
        # I know. the user profile stuff can be done with relations
        # Lets do it in the next revision ;)
        
        #: Set role
        if bundle.obj.groups.all().count() > 0:
            role = bundle.obj.groups.all()[0].name
        else:
            role = 'anonymous'
        bundle.data['role'] = role

        try:
            bundle.data['participant_type'] = bundle.obj.get_profile().participant_type
            bundle.data['twitter'] = bundle.obj.get_profile().twitter
            bundle.data['bio'] = bundle.obj.get_profile().bio
        except UserProfile.DoesNotExist:
            bundle.data['participant_type'] = ''
            bundle.data['twitter'] = ''
            bundle.data['bio'] = ''

        try:
            bundle.data['votes'] = list(bundle.obj.votes.all().values())
        except Vote.DoesNotExist:
            bundle.data['votes'] = None


        if bundle.request.method == "POST":
            apk, created = ApiKey.objects.get_or_create(user=bundle.obj)
            bundle.data['key'] = apk.key

        return bundle


