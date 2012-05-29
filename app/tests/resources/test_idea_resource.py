from django.contrib.auth.models import User, Group
from django.utils import simplejson as json


from core.tests import SWManagerTestCase
from core.models import Idea

import logging
log = logging.getLogger(__name__)


class TestIdeaResource(SWManagerTestCase):
    def setUp(self):
        self.user = User.Factory()
        self.auth_header = {'HTTP_AUTHORIZATION': 'Apikey %s:%s' % (self.user.username, self.user.api_key.key)}

    def test_create_idea(self):
        data = {'name': 'code rico', 
                'description': 'Code the rico way', 
                'participant': {'id': self.user.id}}

        response = self.client.post('/api/v1/ideas/',
                                    content_type='application/json',
                                    data=json.dumps(data),
                                    **self.auth_header)
        logging.info(response)
        
        self.assertEqual(response.status_code, 201)

        response.json = json.loads(response.content)
        self.assertEqual(response.json['participant']['id'], self.user.id)
        self.assertEqual(response.json['name'], data['name'])
        idea = User.objects.get(id=self.user.id).idea.get()
        self.assertEqual(idea.name, data['name'])
        
