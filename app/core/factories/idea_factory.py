import factory
from core.models import Idea
from user_factory import UserFactory


class IdeaFactory(factory.Factory):
    FACTORY_FOR = Idea
    participant = factory.SubFactory(UserFactory)
    name = "TestIdea"
    description = "This is a test idea dude."
Idea.Factory = IdeaFactory
