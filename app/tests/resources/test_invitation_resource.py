from core.tests import SWManagerTestCase

from django.contrib.auth.models import User, Group
from django.utils import simplejson as json

from tastypie.models import ApiKey

import logging
log = logging.getLogger(__name__)


class TestInvitationResource(SWManagerTestCase):
    def setUp(self):
        #        self.user = User.objects.create_user(username="tony2", password="123", email="tony@afasf.com")
        #ApiKey.objects.create(user=self.user)
        self.user = User.Factory()
        self.auth_header = {'HTTP_AUTHORIZATION': 'Apikey %s:%s' % (self.user.username, self.user.api_key.key)}
        print self.auth_header
        self.groups = {
            'admins': Group.Factory(name='admins'),
            'participants': Group.Factory(name='participants'),
            }

    def test_invite_participant(self):
        data = {'email': 'george.cantor@paradise.org', 'role': 'participants'}
        response = self.client.post('/api/v1/invitations/', 
                                    content_type='application/json', 
                                    data=json.dumps(data),
                                    **self.auth_header
                                    )
        logging.info(response)
        self.assertEqual(response.status_code, 201)
        response.json = json.loads(response.content)
        self.assertEqual(response.json['to_object_id'], self.groups[data['role']].id)
        self.assertIn('id', response.json)
        self.assertIn('email', response.json)
        self.assertEqual(response.json['email'], data['email'])
