#!/bin/bash

cd app
echo yes | ./manage.py collectstatic
gunicorn_django -b 0.0.0.0:$PORT -w 4 --max-requests=250 --preload