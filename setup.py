from setuptools import setup
from random import randint


setup(name='swmanager',
      version='0.0.1-%d' % (randint(0, 1000), ),
      description='The Startup Weekend Event Manager',
      author='Ruta N Medellin',
      author_email='castillobuiles@gmail.com',
      packages=[],
      install_requires=[
          'pymongo',
          ])
