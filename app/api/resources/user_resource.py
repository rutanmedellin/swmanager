from django.contrib.auth.models import User
from django.db.models import Q

from tastypie.resources import ModelResource
from tastypie.throttle import CacheThrottle
from tastypie.authorization import Authorization
from tastypie.validation import Validation
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie import fields
from tastypie.constants import ALL


from activation.models import Invitation

from core.models import UserProfile
from api.resources import VoteResource

import logging
log = logging.getLogger(__name__)


class UserResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(UserResourceValidation, self).is_valid(bundle, request)

        if request and request.method == 'PUT':
            return errors
        
        if not bundle.data or 'invitation' not in bundle.data:
            return {'invitation': 'You need an invitation'}

        try:
            bundle.data['invitation'] = Invitation.objects.get(key=bundle.data['invitation'])
        except Invitation.DoesNotExist:
            errors['invitation'] = ["You get an invalid invitation. Contact support guys if you think we are wrong."]

        return errors


class UserResource(ModelResource):
    #TODO: public user

    #role = fields.ToManyField(GroupResource, attribute='groups')

    #votes = fields.ToOneField(VoteResource, 'votes')
    
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

        filtering = {"first_name": ALL,
                     "last_name": ALL,
                     'role': ALL_WITH_RELATIONS,
                     'id': ALL}

    def obj_create(self, bundle, request=None, **kwargs):
        print "obj_create"
        self.is_valid(bundle, request=request)

        if bundle.errors:
            self.error_response(bundle.errors, request)
        
        bundle.obj = UserProfile.objects.sign_up(username=bundle.data['username'],
                                                 email=bundle.data['email'],
                                                 password=bundle.data['password'],
                                                 invitation=bundle.data['invitation'])
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
        #: Set role
        if bundle.obj.groups.all().count() > 0:
            role = bundle.obj.groups.all()[0].name
        else:
            role = 'anonymous'
        bundle.data['role'] = role

        #: Set participant type
        try:
            bundle.data['participant_type'] = bundle.obj.get_profile().participant_type
        except UserProfile.DoesNotExist:
            bundle.data['participant_type'] = ''

        #: Set votes
        bundle.data['votes'] = ['/api/v1/ideas/%s' % v.type_id for v in bundle.obj.votes.all()]
            
        return bundle


