from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields

from core.models import Event


class EventResource(ModelResource):
    class Meta:
        resource_name = 'events'
        queryset = Event.objects.all()
        authorization = Authorization()
        always_return_data = True
        allowed_methods = ['post', 'get', 'put']
