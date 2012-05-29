from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie import fields

from django.db.models import Q

from core.models import Project


class ProjectResource(ModelResource):
    owner = fields.ToOneField('api.resources.UserResource', 'owner', full=True)
    team = fields.ToManyField('api.resources.UserResource', 'team')
    
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'projects'
        authorization = Authorization()
        always_return_data = True
        allowed_methods = ['get', 'post']
        filtering = {
            'owner': ALL_WITH_RELATIONS,
            'team': ALL_WITH_RELATIONS
        }

    def apply_filters(self, request, applicable_filters):
        base_object_list = super(ProjectResource, self).apply_filters(
            request, applicable_filters)

        #: Query filter
        q = request.GET.get('member', None)
        if q:
            qset = ( Q(owner__id=q) | Q(team=q) )
            base_object_list = base_object_list.filter(qset).distinct()

        return base_object_list
