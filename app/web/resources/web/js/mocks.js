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
	
	if (params.type == 'POST' || params.type == 'post') {
		if (params.url.match('.*sessions$') != null) {
			var d = $.parseJSON(params.data);
			
			data = {
				'id': 1,
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
		else 
			if (params.url.match('.*users$') != null) {
				var d = $.parseJSON(params.data);
				data = {
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': d.email,
					'first_name': "",
					'last_name': "",
					'email': d.email,
				};
		}else 
			if (params.url.match('.*invitations$') != null) {
					data = {
						id: 1,
						email: "juanpgaviria@gmail.com",
						role: "admin",
					};
				}
	}else if (params.type == 'GET' || params.type == 'get') {
		if (params.url.match('.*users$') != null) {
				data = {
					"meta": {
						"limit": 20,
						 "next": null, 
						 "offset": 0, 
						 "previous": null, 
						 "total_count": 2
					}, 
					"objects": [
							{
						  		id: 5, 
						  		username: "juanpgaviria",
								email: "juanpgaviria@gmail.com",
								role: "admin",
								first_name: "juan pablo",
								last_name: "gaviria",
								ideas: "/api/v1/ideas/?user=5", 
								projects: "/api/v1/projects/?user=5",
								"resource_uri": "/api/v1/users/5/"			
							},
							{
						  		id: 6, 
						  		username: "castillobuiles",
								email: "castillobuiles@gmail.com",
								role: "admin",
								first_name: "Sebastian",
								last_name: "Castillo",
								ideas: "/api/v1/ideas/?user=6", 
								projects: "/api/v1/projects/?user=6",
								"resource_uri": "/api/v1/users/6/"
							}
					]
				};

				response = data;
			}else if (params.url.match('.*users/[0-9]+$') != null) {
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
			else 
				if (params.url.match('.*invitations$') != null) {
					data = {
						"meta": {
							"limit": 20,
							"next": null,
							"offset": 0,
							"previous": null,
							"total_count": 4
						},
						"objects": [{
							"id": "4f84b22ade94e65caf000010",
							"email": "juanpgaviria@gmail.com",
							"role": "admin",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/",
						}, {
							"id": "4f84b22ade94e65caf000011",
							"email": "castillobuiles@gmail.com",
							"role": "admin",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000012",
							"email": "manuelzs@gmail.com",
							"role": "admin",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000013",
							"email": "elizabeth.ramirez@rutanmedellin.org",
							"role": "participant",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}]
					};
					response = data;
				}
		}
		else if (params.type == 'PUT' || params.type == 'put') {
			log("put");
				if (params.url.match('.*invitations/[A-Za-z0-9]+$') != null) {
					log("invitation");
					var d = $.parseJSON(params.data);
					data = {
						"id": d.id,
						"email": d.email,
						"role": d.role,
						"resource_uri": d.resource_uri,
					};
					response = data;
				}
		}
		else if (params.type == 'DELETE' || params.type == 'delete') {
			log("put");
			if (params.url.match('.*invitations/[A-Za-z0-9]+$') != null) {
				data = {
				};
				response = data;
			}
			
		}else {
			ajax(params);
		}
	params.success(data);
};
  
