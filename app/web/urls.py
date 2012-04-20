from django.conf.urls.defaults import patterns, include, url


urlpatterns = patterns('',
    url(r'^templates.js$', 'web.views.jst'),
)
