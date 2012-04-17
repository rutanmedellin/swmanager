/* templates.js */

$(document).ready(function(){
    window.JST = window.JST || {};
    {% for name, code in templates.items %}
    window.JST['{{ name }}'] = _.template('{{ code|safeseq|join:"" }}');
    {% endfor %}
});

