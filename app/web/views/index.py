# view to render the index.html 
from django.shortcuts import render_to_response
import logging


def home(request):
    """ Render templates/web/index.html."""
    
    return render_to_response(
        'web/index.html' 
        )


    
    


