import factory
from django.contrib.auth.models import User


class UserFactory(factory.Factory):
    FACTORY_FOR = User
    username = "tony"
    email = "tmontana@scarface.com"
    password = 'sha1$f7b2d$6a42b767f4eb5ffdf3c29ba9776317ca7be53831' # 123
User.Factory = UserFactory


class ParticipantFactory(UserFactory):
    pass
