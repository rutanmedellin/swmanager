import factory
from random import randint
from activation.models import Invitation
from user_factory import UserFactory
from group_factory import GroupFactory


class InvitationFactory(factory.Factory):
    FACTORY_FOR = Invitation
    host = factory.SubFactory(UserFactory, username="thehost")
    key = factory.LazyAttribute(lambda a: str(randint(1, 100000)))
    to = factory.SubFactory(GroupFactory)
Invitation.Factory = InvitationFactory
