from core.tests import SWManagerTestCase
from core.models import Vote
from core.models import Idea
from django.contrib.auth.models import User

from django.utils import simplejson as json

import core.factories

import logging
log = logging.getLogger(__name__)


class TestVoteResource(SWManagerTestCase):
    def setUp(self):
        self.idea = Idea.Factory(participant__username = "pepe")
        self.user = User.Factory(username="antonio")
        self.auth_header = {'HTTP_AUTHORIZATION': 'Apikey %s:%s' % (self.user.username, self.user.api_key.key)}

        
    def test_create_vote(self):
        data = {'user': {'id': self.user.id},
                'vote_type': 'idea',
                'type_id': self.idea.id}
       
        response = self.client.post('/api/v1/votes/',
                                    content_type='application/json',
                                    data=json.dumps(data),
                                    **self.auth_header)
        logging.info(response)
        self.assertEqual(response.status_code, 201)

        response.json = json.loads(response.content)
        self.assertEqual(response.json['user']['id'], self.user.id)

        votes = Vote.objects.filter(vote_type='idea', type_id=self.idea.id).count()

        idea_response = self.client.get('/api/v1/ideas/', **data)
        print idea_response
        
        idea_response.json = json.loads(idea_response.content)
        self.assertEqual(idea_response.json['objects'][0]['votes'], 1)
        self.assertEqual(votes, 1)
        
