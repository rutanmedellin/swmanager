var ajax = $.ajax;
var response;
$.ajax = function ajaxMock(params) {
	log('Mock Request\ntype: ' + params.type + '\nurl: ' + params.url);
	
	var data = {
		"messages": [{
		  "type": "error",
		  "message": "No mock defined for request"
		}]
	};
	
	if(params.type == 'POST' || params.type == 'post'){
		if (params.url.match('.*sessions$') != null) {
			var d = $.parseJSON(params.data);
			
			data = {'id': 1,
					'key': "12345",
					'resource_uri': "/api/v1/sessions/1",
					'user': {
						'id': 1,
						'username': d.username,
						'first_name': "juan",
						'last_name': "gaviria",
						'email': "juanpgaviria@gmail.com",
						'resource_uri': "/api/v1/users/1"
						}
					};
			response = data;
			account_data = {
				user: data
			};
		}
		else if (params.url.match('.*users/self/changepassword$') != null) {
	  		data = {
		      "messages": {
			  		"type": "info",
			  		"message": "Your password has been changed."
		    	}
	  		};
	  	}
	}
	params.success(data);
};
  
