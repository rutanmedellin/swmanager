import sys, time
from activation.models import Invitation
from django.contrib.auth.models import User, Group


def get_participants():
    print "Start"
    with open('templates/participants.txt') as f:
        user = User.objects.get(username='castillobuiles@gmail.com')
        group = Group.objects.get(name='participants')
        for email in f.readlines():
            email = email.strip()
            Invitation.objects.create_invitation(user,
                                                 to=group,
                                                 email=email,
                                                 )
            print ".",
            sys.stdout.flush()
            time.sleep(3)
    print "Done"
            
get_participants()
