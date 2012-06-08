import sys
from app.core.models import UserProfile, Project
from django.contrib.auth.models import User, Group


USERNAME_TEMPLATE = 'castillobuiles+p_%s@gmail.com'


def create_participants(count=100):
    print "Creating participants: ",
    for i in xrange(count):
        uname =  USERNAME_TEMPLATE % i
        user = UserProfile.objects.sign_up(username=uname, email=uname, password='qwerty123!')
        user.groups.add(Group.objects.get(name='participants'))
        user.save()
        print ".",
        sys.stdout.flush()
    print "Done"

    
def create_projects(count=20, participants=5):
    print "Creating projects: ",
    for i in xrange(count):
        project = Project.objects.create(
            owner=User.objects.get(username=USERNAME_TEMPLATE % i),
            name='project_%s' % i,
            description='project_%s' % i,
            twitter='castillobuiles',
            url='http://bebetr.com',
            image='http://www.gravatar.com/avatar/c99267b64dd9250cd5fbda55bb2b2c72',
            email='castillobuiles@gmail.com',
            )
        for j in xrange(participants):
            project.team.add(User.objects.get(username=USERNAME_TEMPLATE % (i+j)))
        project.save()
        print ".",
        sys.stdout.flush()
    print "Done"


def main():
    print "Start"
    create_participants()
    create_projects()
    print "End"


main()
