from tastypie.resources import ModelResource
from tastypie.models import ApiKey
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie import fields

from core.models import Idea
from api.resources import UserResource


class IdeaResource(ModelResource):
    participant = fields.ToOneField('api.resources.UserResource', 'participant', full=True)
    #participant = fields.ToOneField(UserResource, 'participant', full=True)
    
    class Meta:
        queryset = Idea.objects.all()
        resource_name = 'ideas'
        authorization = Authorization()
        #authentication = ApiKeyAuthentication()
        always_return_data = True
        allowed_methods = ['post', 'get']
