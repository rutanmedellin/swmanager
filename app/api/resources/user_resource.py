from django.contrib.auth.models import User
from tastypie.resources import ModelResource
from tastypie.throttle import CacheThrottle


class UserResource(ModelResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'users'
        fields = ['username', 'email', 'first_name', 'last_name']
        resource_uri_fieldname = 'username'
        allowed_methods = ['get', 'put']
        always_return_data = True
        throttle = CacheThrottle(throttle_at=200)
