from tastypie.resources import ModelResource
from tastypie.constants import ALL
from tastypie.authorization import Authorization

from django.contrib.auth.models import Group
    

class GroupResource(ModelResource):
    class Meta:
        queryset = Group.objects.all()
        include_resource_uri = False
        allowed_methods = ['get']
        resource_name = 'groups'
        authorization = Authorization()
        filtering = {
            "name": ALL
        }
        
