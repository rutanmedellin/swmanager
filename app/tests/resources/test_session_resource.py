import logging
from django.contrib.auth.models import User

from core.tests import SWManagerTestCase


class TestSessionResource(SWManagerTestCase):
    def setUp(self):
        self.user = User.Factory(username="tony")
    
    def test_create_session(self):
        """
        Test create a session

        In order to acces to the her data,
        a user should create a session using
        basic authentication.
        
        Then using the api_key returned as part
        of the session she will be authorized
        to access other respurces. (token auth)
        
        TODO: Timed token invalidation. 
              Right now you can renovate your api key
        """
        username = 'tonymontana'
        user = User.Factory(username=username)
        response = self.client.post('/api/v1/public/sessions/', 
                                    content_type='application/json',
                                    **self.get_auth_headers(username=username, password='123'))
        logging.info(response)
        self.assertEqual(response.status_code, 201)
