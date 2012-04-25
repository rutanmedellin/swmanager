import factory
from django.contrib.auth.models import Group


class GroupFactory(factory.Factory):
    FACTORY_FOR = Group
    name = 'test_group'

Group.Factory = GroupFactory
