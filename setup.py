from setuptools import setup
from random import randint


setup(name='swmanager',
      version='0.0.1-%d' % (randint(0, 1000), ),
      description='The Startup Weekend Event Manager',
      author='Ruta N Medellin',
      author_email='castillobuiles@gmail.com',
      packages=[],
      dependency_links = [
         #django-nonrel, currently a fork from django v1.3
         'hg+http://bitbucket.org/wkornewald/django-nonrel#egg=Django',
    
         # djangotoolbox
         'hg+https://bitbucket.org/wkornewald/djangotoolbox#egg=djangotoolbox',
    
         # django_mongodb_engine
         'git+https://github.com/django-nonrel/mongodb-engine#egg=django_mongodb_engine',
    
         # auth backend
         'git+https://github.com/django-nonrel/django-permission-backend-nonrel.git#egg=permission_backend_nonrel',
    
         # hacked-on version of tastypie
         #'git+https://github.com/andresdouglas/django-tastypie.git@nonrel#egg=tastypie',
         'git+https://github.com/toastdriven/django-tastypie.git#egg=tastypie',
         # django-jasmine with jasmine-1.2.0.rc3
         'git+https://github.com/juanpgaviria/django-jasmine.git'

      ],
      install_requires=[
            'pymongo',
            
            #tastie dependecies
            'mimeparse>=0.1.3',
            'python-dateutil',
            'lxml',
            'PyYAML',
            'biplist',
            
            #utilities
            'django-extensions',
          ])
