from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields

from core.models import Project


class ProjectResource(ModelResource):
    owner = fields.ToOneField('api.resources.UserResource', 'owner', full=True)
    
    
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'projects'
        authorization = Authorization()
        always_return_data = True
        allowed_methods = ['get', 'post']
