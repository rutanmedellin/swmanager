from tastypie.resources import ModelResource
from tastypie.models import ApiKey
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie.validation import Validation
from tastypie import fields

from django.contrib.auth.models import Group, User

from activation.models import Invitation


class InvitationResourceValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = super(InvitationResourceValidation, self).is_valid(bundle, request)
        
        if not bundle.data:
            return {'__all__': 'You need data for the invitation'}

        valid_group = False
        if 'role' in bundle.data:
            valid_group = True if Group.objects.filter(name=bundle.data['role']).count() > 0 else False

        if not valid_group:
            errors['role'] = 'You need a role like "participants" or "admins"'
        
        if not 'email' in bundle.data:
            errors['email'] = 'You need an email to send the invitation'

        if 'email' in bundle.data and 'role' in bundle.data:
            if Invitation.objects.filter(email=bundle.data['email']).count() > 0:
                errors['email'] = 'There is a pending invitation to this email. May be you want to resend it?'
            if User.objects.filter(email=bundle.data['email']).count() > 0:
                errors['email'] = 'Email already taken on the system. Are you inviting an existing user?'
            
        return errors

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
        authentication = ApiKeyAuthentication()
        always_return_data = True
        allowed_methods = ['get', 'post', 'delete']
        validation = InvitationResourceValidation()
    
    def obj_create(self, bundle, request=None, **kwargs):
        " Create a new invitation using the default manager "
        
        self.is_valid(bundle, request=request)

        if bundle.errors:
            self.error_response(bundle.errors, request)

        group = Group.objects.get(name=bundle.data['role'])
        print "#### create invitation"
        bundle.obj = Invitation.objects.create_invitation(request.user, 
                                                          to=group,
                                                          email=bundle.data['email'])
        return bundle

    def dehydrate_to_object_id(self, bundle):
        return int(bundle.obj.to_object_id)

    def dehydrate(self, bundle):
        bundle.data['role'] = bundle.obj.to.name
        return bundle
