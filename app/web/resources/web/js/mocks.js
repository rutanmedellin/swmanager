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
		else if (params.url.match('.*users/[0-9]+$') != null) {
	  		data = {'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					};
	  	}
		else if (params.url.match('.*invitations$') != null){
			data = {
				id: 1,
				email: "juanpgaviria@gmail.com",
				role: "admin",
			};
		}
	}
	else if (params.type == 'GET' || params.type == 'get'){
		if (params.url.match('.*users/[0-9]+$') != null) {
			data = {
				'id': 1,
				'resource_uri': "/api/v1/users/1",
				'username': "juanpgaviria",
				'first_name': "juan",
				'last_name': "gaviria",
				'email': "juanpgaviria@gmail.com",
				'role': "admin",
				'bio': "hola mundo",
				'ideas': "/api/v1/ideas/?user=1",
				'projects': "/api/v1/projects/?user=1"
			};
			response = data;
		}
		
	}
	params.success(data);
};
  
