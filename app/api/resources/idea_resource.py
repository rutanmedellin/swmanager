from tastypie.resources import ModelResource
from tastypie.models import ApiKey
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie.validation import Validation
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie import fields

from core.models import Idea, Vote
from api.resources import UserResource

class IdeaResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(IdeaResourceValidation, self).is_valid(bundle, request)

        if 'participant' not in bundle.data:
            errors['participant'] = "Can not be empty"

        return errors

class IdeaResource(ModelResource):
    participant = fields.ToOneField('api.resources.UserResource', 'participant', full=True)
    #participant = fields.ToOneField(UserResource, 'participant', full=True)

    class Meta:
        queryset = Idea.objects.all()
        resource_name = 'ideas'
        authorization = Authorization()
        #authentication = ApiKeyAuthentication()
        validation = IdeaResourceValidation()
        always_return_data = True
        allowed_methods = ['post', 'get', 'put', 'delete']
        filtering = {
            'participant': ALL_WITH_RELATIONS
        }

    def obj_delete(self, request=None, **kwargs):
        obj = kwargs.get('_obj', None)
        if obj:
            Vote.objects.filter(type_id = obj.id).delete()
        super(IdeaResource, self).obj_delete(request, **kwargs)

    def dehydrate(self, bundle):
        bundle.data['votes'] = Vote.objects.filter(vote_type='idea',
                                                   type_id="/api/v1/ideas/%s/" % bundle.obj.id).count()
        return bundle
