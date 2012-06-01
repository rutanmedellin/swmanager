from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie.validation import Validation
from tastypie import fields
from tastypie.constants import ALL

from core.models import Vote
from api.resources import UserResource


class VoteResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(VoteResourceValidation, self).is_valid(bundle, request)
        print "user: %s" % request.user
        user_votes = Vote.objects.filter(user_id=request.user.id)
        if user_votes.count() >= 3:
            errors['count'] = "Oh boy, just 3 votes, don't be greedy ;)"
        for v in user_votes:
            if v.type_id == bundle.data.get('type_id', ''):
                errors['type_id'] = "You already have a vote for this type_id"

        
        return errors

class VoteResource(ModelResource):

    user = fields.ToOneField('api.resources.UserResource', 'user', full=True)
    
    class Meta:
        queryset = Vote.objects.all()
        resource_name = 'votes'
        authorization = Authorization()
        authentication = ApiKeyAuthentication()
        validation = VoteResourceValidation()
        filtering ={
            'user': ALL,
        }
        
        always_return_data = True
        allowed_methods = ['post', 'get']
        
        
