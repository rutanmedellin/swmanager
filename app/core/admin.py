from django.contrib import admin
from tastypie.models import ApiKey

from core.models import Event

admin.site.register(Event)
