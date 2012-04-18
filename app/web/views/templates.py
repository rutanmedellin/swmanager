from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext

import logging
import os


def jst(request):

    templates = {}
    jst_path = os.path.join(os.path.dirname(__file__), "../resources/web/jst/")

    print "path: %s" % jst_path

    for path in os.listdir(jst_path):
        try:
            with open(os.path.join(jst_path, path), 'r') as jst_file:
                templates[path.split('.')[0]] = [l.rstrip('\n').replace("'", '"') for l in jst_file.readlines()]
        except IOError, e:
            logging.error(e)

    print "templates: %s" % templates

    return render_to_response(
        'web/templates.js', 
        RequestContext(request, {'templates': templates}),
        mimetype="text/javascript",
        )

