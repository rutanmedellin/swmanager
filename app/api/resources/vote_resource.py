from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from core.models import Vote


class VoteResource(ModelResource):
    class Meta:
        queryset = Vote.objects.all()
        resource_name = 'votes'
        authorization = Authorization()
        always_return_data = True
        allowed_methods = ['post', 'get']
