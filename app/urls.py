from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.conf import settings
from tastypie.api import Api
admin.autodiscover()

from api.resources import UserResource
from api.resources import PublicSessionResource
from api.resources import InvitationResource
from api.resources import IdeaResource
from api.resources import EventResource
from api.resources import VoteResource
from api.resources import ProjectResource

from web.views.blitz import index as blitz

swm_api = Api(api_name='v1')
swm_api.register(UserResource())
swm_api.register(PublicSessionResource())
swm_api.register(InvitationResource())
swm_api.register(IdeaResource())
swm_api.register(EventResource())
swm_api.register(VoteResource())
swm_api.register(ProjectResource())

urlpatterns = patterns(
    'django.views.generic.simple',
    url(r'^/?$', 'direct_to_template', {'template': 'web/index.html', 
                                        'extra_context': {'mocks': settings.MOCK_API_FOR_JS}
                                        }
    ),
)

urlpatterns += patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(swm_api.urls)),
    url(r'^web/', include('web.urls')),
    
    # jasmine testings urls
    url(r'^jasmine/', include('django_jasmine.urls')),

    url(r'^mu-04a82b9e-1eab12b7-71e4fb90-e88c3b98', blitz),
    
)



urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )


# redirect to dinami url from canonical url
urlpatterns += patterns('django.views.generic.simple',
    ('^hash/(?P<org_url>[A-Za-z0-9/]+)$', 'redirect_to', {'url': '/#!/%(org_url)s'}),
)
