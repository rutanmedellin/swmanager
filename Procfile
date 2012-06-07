#web: gunicorn_django -b 0.0.0.0:$PORT -w3 app.wsgi
#web: gunicorn_django -b 0.0.0.0 -w 9 -k gevent --max-requests 250 --preload
#web: ./swmanager_ru\n.sh
web: python app/manage.py collectstatic --noinput; gunicorn_django -b 0.0.0.0:$PORT -w3 app.wsgi