from settings import *

ENVIRONMENT = "development"

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine',
        'NAME': 'swmanager_dev',
        'USER': '',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': 27017,
    }
}
