# Startup Weekend Event Manager

## Project Resources
  * Pivotal Tracker is used for managing stories: https://www.pivotaltracker.com/projects/496655
  * Git is used for source control, canonical repo is at https://github.com/rutanmedellin/swmanager
  * Travis _will be_ used for Continuous Integration, CI server _will be_ located at http://
  * Staging server is at http://swmanager.herokuapps.com
  * Admin web console is at http://swmanager.herokuapps.com/admin

## Convention for commits

Prepend the Pivotal Tracker story number to each commit.  E.g.,:

[15123994] Adding token authentication

## Git practices

  * Use git pull --rebase instead of git --pull wherever possible to avoid meaningless merge commits in the project history.
  * Squash and cherrypick are your friends :) https://makandracards.com/makandra/527-squash-several-git-commits-into-a-single-commit

## Virtualenv

This project uses Virtualenv and distribute/pip to install dependencies. Make sure you have virtualenv installed locally and maybe virtualenv_wrapper. For more info go to the wiki section and check development enviroment deployment topics.

## MongoDB and Django

This project runs django and tastypie specific version to work with mongodb. See the requirements.txt file for details.

## Unit testing

This project uses unittest2 with nose as runner trough TOX.

### Running tests
```
$ cd /path/to/project/root/
$ tox
```