from core.tests import SWManagerTestCase

from activation.models import Invitation

from django.contrib.auth.models import User, Group
from django.utils import simplejson as json

from core import factories

import logging
log = logging.getLogger(__name__)


class TestUserResource(SWManagerTestCase):
    def setUp(self):
        self.invitation = Invitation.Factory(to__name='participants')

    def test_participant_signup(self):
        data = {'code': self.invitation.key,
                'username': 'invited_montana',
                'email': 'invited@montana.com',
                'password': 'secrect'}

        response = self.client.post('/api/v1/users/', data=json.dumps(data), content_type='application/json')
        logging.info(response)
        self.assertEqual(response.status_code, 201)
        response.json = json.loads(response.content)
        print response.json
        self.assertEqual('participants', response.json.get('role'))

    def test_participant_signup_with_invaild_invitation(self):
        data = {'code': None,
                'username': 'invited_montana',
                'email': 'invited@montana.com',
                'password': 'secrect'}

        response = self.client.post('/api/v1/users/', data=json.dumps(data), content_type='application/json')
        logging.info(response)
        self.assertEqual(response.status_code, 400)

    def test_user_query(self):
        response = self.client.get('/api/v1/users/', {'q': 'user'})

    def test_get_user_by_role(self):
        response = self.client.get('/api/v1/users/', {'role': 'participants'})

    def test_get_user_by_participant_type(self):
        response = self.client.get('/api/v1/users/', {'participant_type': 'developer'})
