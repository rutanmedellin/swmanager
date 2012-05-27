from django.contrib import admin
from tastypie.models import ApiKey

from core.models import Event
from core.models import Vote
from core.models import Idea


admin.site.register(Event)
admin.site.register(Vote)
admin.site.register(Idea)
