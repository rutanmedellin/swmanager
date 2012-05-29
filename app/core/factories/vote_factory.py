import factory
from core.models import Vote
from user_factory import UserFactory


class VoteFactory(factory.Factory):
    FACTORY_FOR = Vote
    user = factory.SubFactory(UserFactory)
    vote_type = 'idea'
    type_id = 1
Vote.Factory = VoteFactory
