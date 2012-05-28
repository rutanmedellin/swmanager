from tastypie.resources import ModelResource
from tastypie.models import ApiKey
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie import fields

from django.contrib.auth.models import Group

from activation.models import Invitation


class InvitationResource(ModelResource):
    """
    Invitations

    An administrative user invites other administrative users or participants
    to be enrolled on a particular event.
    
    Participants can send invitations to team mates.
    """

    class Meta:
        queryset = Invitation.objects.all()
        resource_name = 'invitations'
        authorization = Authorization()
        #authentication = ApiKeyAuthentication()
        always_return_data = True
    
    def obj_create(self, bundle, request=None, **kwargs):
        " Create a new invitation using the default manager "
        
        self.is_valid(bundle, request=request)
        group = Group.objects.get(name=bundle.data['role'])
        bundle.obj = Invitation.objects.create_invitation(request.user, 
                                                          to=group,
                                                          email=bundle.data['email'])
        return bundle

    def dehydrate_to_object_id(self, bundle):
        return int(bundle.obj.to_object_id)
    
