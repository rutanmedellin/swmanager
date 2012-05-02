from core.tests import SWManagerTestCase

from activation.models import Invitation

from django.contrib.auth.models import User, Group
from django.utils import simplejson as json

import logging
log = logging.getLogger(__name__)


class TestUserResource(SWManagerTestCase):
    def setUp(self):
        self.invitation = Invitation.Factory(to__name='participants')

    def test_participant_signup(self):
        data = {'invitation': self.invitation.key,
                'username': 'invited_montana',
                'email': 'invited@montana.com',
                'password': 'secrect'}

        response = self.client.post('/api/v1/users/', data=json.dumps(data), content_type='application/json')
        logging.info(response)
        self.assertEqual(response.status_code, 201)
        response.json = json.loads(response.content)
        print response.json
        self.assertIn('participants', response.json.get('roles'))
