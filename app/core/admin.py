from django.contrib import admin
from tastypie.models import ApiKey

from core.models import UserProfile
from core.models import Event
from core.models import Vote
from core.models import Idea
from core.models import Project
from core.models import Session

admin.site.register(UserProfile)
admin.site.register(Event)
admin.site.register(Vote)
admin.site.register(Idea)
admin.site.register(Project)
admin.site.register(Session)
