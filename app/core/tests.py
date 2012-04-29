import base64
from django.test import TestCase


class SWManagerTestCase(TestCase):
    " Base test case for swmanager porject "
    def get_auth_headers(self, username, password):
        auth_headers = {
            'HTTP_AUTHORIZATION': 'Basic ' + base64.b64encode('%s:%s' % (username, password)),
            'CONTENT_TYPE': 'application/json',
            }
        return auth_headers
