from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie.validation import Validation

from core.models import Vote


class VoteResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(VoteResourceValidation, self).is_valid(bundle, request)
        print "user: %s" % request.user
        vote_count = Vote.objects.filter(user_id=request.user.id).count()
        if vote_count >= 3:
            errors['count'] = "Oh boy, just 3 votes, don't be greedy ;)"
        print "count= %s" % vote_count
        return errors

class VoteResource(ModelResource):
    class Meta:
        queryset = Vote.objects.all()
        resource_name = 'votes'
        authorization = Authorization()
        authentication = ApiKeyAuthentication()
        validation = VoteResourceValidation()
        
        always_return_data = True
        allowed_methods = ['post', 'get']
        
        
