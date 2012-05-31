var ajax = $.ajax;
var response;
$.ajax = function ajaxMock(params) {
	log('Mock Request\ntype: ' + params.type + '\nurl: ' + params.url);
	
	var data = "";
	
	if (params.type == 'POST' || params.type == 'post') {
		if (params.url.match('.*sessions/$') != null) {
			var d = $.parseJSON(params.data);
			
			data = {
				'id': 1,
				'key': "12345",
				'resource_uri': "/api/v1/sessions/1/",
				'user': {
					'id': 1,
					'username': d.username,
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'resource_uri': "/api/v1/users/1/"
				}
			};
			response = data;
			account_data = {
				user: data
			};
		}
		else 
			if (params.url.match('.*users/$') != null) {
				var d = $.parseJSON(params.data);
				data = {
					'id': 1,
					'resource_uri': "/api/v1/users/1/",
					'username': d.email,
					'first_name': "",
					'last_name': "",
					'email': d.email,
				};
		}else 
			if (params.url.match('.*invitations/$') != null) {
					data = {
						id: 1,
						email: "juanpgaviria@gmail.com",
						role: "admins",
					};
	    }else if (params.url.match('.*ideas/$') != null) {
			var d = $.parseJSON(params.data);
			data = {
				"id": "4f84b22ade94e65caf000011",
				"participant": {
					id: "2",
					email: "castillobuiles@gmail.com",
					username: "castillobuiles@gmail.com",
					first_name: "sebastian",
					last_name: "castillo",
					"resource_uri": "/api/v1/users/2/",	
				},
				"isProject": false,
				"name": d.name,
				"description": d.description, 
 				"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
			};
		}else if (params.url.match('.*projects/$') != null) {
			var d = $.parseJSON(params.data);
			data = {
				"id": "4f84b22ade94e65caf000011",
				"owner": {
					id: "2",
					email: "castillobuiles@gmail.com",
					username: "castillobuiles@gmail.com",
					first_name: "sebastian",
					last_name: "castillo",
					"resource_uri": "/api/v1/users/2/",	
				},
				"name": d.name,
				"team": [],
				"description": d.description, 
 				"resource_uri": "/api/v1/proejcts/4f84b22ade94e65caf000011/",
			};
		}else if (params.url.match('.*votes/$') != null) {
			var d = $.parseJSON(params.data);
			data = {
				"id": "4f84b22ade94e65caf000011",
				"user": {
					id: d.user,
					email: "castillobuiles@gmail.com",
					username: "castillobuiles@gmail.com",
					first_name: "sebastian",
					last_name: "castillo",
					"resource_uri": "/api/v1/users/2/",	
				},
				"type": d.type,
				"type_id": d.type_id, 
 				"resource_uri": "/api/v1/votes/4f84b22ade94e65caf000011/",
			};
		}else if (params.url.match('.*events/$') != null) {
			var d = $.parseJSON(params.data);
			data = {
				"id": "4f84b22ade94e65caf000011",
				'resource_uri': "/api/v1/events/4f84b22ade94e65caf000011",
				'name': d.name,
				'email': d.email,
				'twitter': d.twitter,
				'description': d.description,
				'url': d.url,
				'start_date': d.start_date,
				'end_date': d.end_date,
				'cover': d.cover,
			};
		}
	}else if (params.type == 'GET' || params.type == 'get') {
		if (params.url.match('.*users/$') != null) {
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
								role: "admins",
								first_name: "juan pablo",
								last_name: "gaviria",
								ideas: "/api/v1/ideas/?user=5", 
								projects: "/api/v1/projects/?user=5",
								twitter: "juanpgaviria",
								participant_type: "",
								'bio': "hola mundo",
								"resource_uri": "/api/v1/users/5/"			
							},
							{
						  		id: 6, 
						  		username: "castillobuiles",
								email: "castillobuiles@gmail.com",
								role: "admins",
								first_name: "Sebastian",
								last_name: "Doctor",
								ideas: "/api/v1/ideas/?user=6", 
								projects: "/api/v1/projects/?user=6",
								twitter: "scastillo",
								participant_type: "developer",
								'bio': "hola mundo",
								"resource_uri": "/api/v1/users/6/"
							},							
							{
						  		id: 7, 
						  		username: "castillobuiles",
								email: "castillobuiles@gmail.com",
								role: "participants",
								first_name: "Sebastian",
								last_name: "Castillo",
								ideas: "/api/v1/ideas/?user=6", 
								projects: "/api/v1/projects/?user=6",
								twitter: "scastillo",
								participant_type: "non-tech",
								'bio': "hola mundo",
								"resource_uri": "/api/v1/users/6/"
							}
					]
				};

				response = data;
			}else if (params.url.match('.*users/[0-9]+/$') != null) {
				data = {
					'id': 1,
					'resource_uri': "/api/v1/users/1/",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "juanpgaviria", 
					'role': "admins",
					'bio': "hola mundo",
					'participant_type': 'non-tech',
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				};
				response = data;
			}
			else if (params.url.match('.*invitations/$') != null) {
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
							"role": "admins",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/",
						}, {
							"id": "4f84b22ade94e65caf000011",
							"email": "castillobuiles@gmail.com",
							"role": "admins",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000012",
							"email": "manuelzs@gmail.com",
							"role": "admins",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000013",
							"email": "elizabeth.ramirez@rutanmedellin.org",
							"role": "participants",
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/",
						}]
					};
					response = data;
			}else if (params.url.match('.*ideas/$') != null) {
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
							"participant": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							"isProject": false,
							"name": "test",
							"votes": 0,
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000010/",
						}, {
							"id": "4f84b22ade94e65caf000011",
							"participant": {
								id: "2",
								email: "castillobuiles@gmail.com",
								username: "castillobuiles@gmail.com",
								first_name: "sebastian",
								last_name: "castillo",
								"resource_uri": "/api/v1/users/2/",	
							},
							"isProject": false,
							"name": "test",
							"votes": 10,
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000012",
							"participant": {
								id: "3",
								email: "manuelzs@gmail.com",
								username: "manuelzs@gmail.com",
								first_name: "manuel",
								last_name: "zapata",
								"resource_uri": "/api/v1/users/3/",	
							},
							"isProject": false,
							"name": "test",
							"votes": 15,
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000013",
							"participant": {
								id: "4",
								email: "elizabeth.ramirez@rutanmedellin.org",
								username: "elizabeth.ramirez@rutanmedellin.org",
								first_name: "Eliza",
								last_name: "Ramirez",
								"resource_uri": "/api/v1/users/4/",	
							},
							"isProject": false,
							"name": "test",
							"votes": 2,
							"description": "test",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}]
					};
					response = data;
				}else if (params.url.match('.*ideas/[A-Za-z0-9]+/$') != null) {
					data = {
							"id": "4f84b22ade94e65caf000010",
							"participant": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							"name": "test",
							"isProject": false,
							"votes": 2,
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000010/",
					  };
				}else if (params.url.match('.*projects/$') != null){
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
							"owner": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							"name": "test",
							"votes": 10,
							"twitter": "project1",
							"team": [{
									id: "2",
									email: "castillobuiles@gmail.com",
									username: "castillobuiles@gmail.com",
									first_name: "Sebastian",
									last_name: "Castillo",
									"resource_uri": "/api/v 1/users/2/",	
								},{
									id: "3",
									email: "manuelzs@gmail.com",
									username: "manuelzs@gmail.com",
									first_name: "Manuel",
									last_name: "Zapata",
									"resource_uri": "/api/v1/users/3/",	
								}],
							"url": "http://myprojeect.com",
							"image": "http://graph.facebook.com/StartupWeekendColombia/picture?type=normal",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000010/",
						}, {
							"id": "4f84b22ade94e65caf000011",
							"owner": {
								id: "2",
								email: "castillobuiles@gmail.com",
								username: "castillobuiles@gmail.com",
								first_name: "sebastian",
								last_name: "castillo",
								"resource_uri": "/api/v1/users/2/",	
							},
							"name": "test",
							"votes": 20,
							"team": [],
							"url": "http://myprojeect.com",
							"twitter": "juanpgaviria",
							"image": "http://graph.facebook.com/StartupWeekendColombia/picture?type=normal",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000012",
							"owner": {
								id: "3",
								email: "manuelzs@gmail.com",
								username: "manuelzs@gmail.com",
								first_name: "manuel",
								last_name: "zapata",
								"resource_uri": "/api/v1/users/3/",	
							},
							"name": "test",
							"votes": 0,
							"team": [],
							"url": "http://myprojeect.com",
							"twitter": "juanpgaviria",
							"image": "http://graph.facebook.com/StartupWeekendColombia/picture?type=normal",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000013",
							"owner": {
								id: "4",
								email: "elizabeth.ramirez@rutanmedellin.org",
								username: "elizabeth.ramirez@rutanmedellin.org",
								first_name: "Eliza",
								last_name: "Ramirez",
								"resource_uri": "/api/v1/users/4/",	
							},
							"name": "test",
							"votes": 11,
							"url": "http://myprojeect.com",
							"team": [],
							"image": "http://graph.facebook.com/StartupWeekendColombia/picture?type=normal",
							"description": "test",
							"twitter": "juanpgaviria",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000011/",
						}]
					};
				}else if (params.url.match('.*projects/[A-Za-z0-9]+/$') != null) {
					data = {
							"id": "4f84b22ade94e65caf000013",
							"owner": {
								id: "4",
								email: "elizabeth.ramirez@rutanmedellin.org",
								username: "elizabeth.ramirez@rutanmedellin.org",
								first_name: "Eliza",
								last_name: "Ramirez",
								name: "Eliza Ramirez",
								"resource_uri": "/api/v1/users/4/",	
							},
							"name": "test",
							"image": "http://graph.facebook.com/StartupWeekendColombia/picture?type=normal",
							"url": "http://myprojeect.com",
							"votes": 11,
							"twitter": "juanpgaviria",
							"team": [{
									id: "2",
									email: "castillobuiles@gmail.com",
									username: "castillobuiles@gmail.com",
									first_name: "Sebastian",
									last_name: "Castillo",
									name: "Sebastian Castillo",
									"resource_uri": "/api/v 1/users/2/",	
								},{
									id: "3",
									email: "manuelzs@gmail.com",
									username: "manuelzs@gmail.com",
									first_name: "Manuel",
									last_name: "Zapata",
									name: "Manuel Zaapta",
									"resource_uri": "/api/v1/users/3/",	
								}],
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000011/",
						};
				}else if (params.url.match('.*events/$') != null) {
					data = {
						"meta": {
							"limit": 20,
							"next": null,
							"offset": 0,
							"previous": null,
							"total_count": 0
						},
						"objects": [
						{
							'id': 1,
							'resource_uri': "/api/v1/events/1",
							'name': "Startup Weekend Medellín",
							'email': "medellin@startupweekend.org",
							'twitter': "SWCol",
							'description': "Hola mundo",
							'url': 'http://medellin.startupweekend.org',
							'streaming_url': 'http://medellin.startupweekend.org',
							'start_date': "2012-05-26T17:30:00",
							'end_date': "2012-05-28T19:15:00",
							'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
						}]
					};
				}else if (params.url.match('.*events/[A-Za-z0-9]+/$') != null) {
					data = {
							'id': 1,
							'resource_uri': "/api/v1/events/1",
							'name': "Startup Weekend Medellín",
							'email': "medellin@startupweekend.org",
							'twitter': "SWCol",
							'description': "Hola mundo",
							'url': 'http://medellin.startupweekend.org',
							'streaming_url': 'http://medellin.startupweekend.org',
							'start_date': "2012-06-08T17:30:00",
							'end_date': "2012-06-10T19:30:00",
							'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
						};
				}
		}
		else if (params.type == 'PUT' || params.type == 'put') {
				if (params.url.match('.*invitations/[A-Za-z0-9]+/$') != null) {
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
				else 
					if (params.url.match('.*users/[A-Za-z0-9]+/$') != null) {
						var d = $.parseJSON(params.data);
						data = {
							'id': d.id,
							'resource_uri': "/api/v1/users/" + d.id + "/",
							'username': d.username,
							'first_name': d.first_name,
							'last_name': d.last_name,
							'email': "juanpgaviria@gmail.com",
							'twitter': d.twitter,
							'role': d.role,
							'bio': d.bio,
							'ideas': "/api/v1/ideas/?user=" + d.id,
							'projects': "/api/v1/projects/?user=" + d.id
						};
						response = data;
					}
					else if (params.url.match('.*ideas/[A-Za-z0-9]+/$') != null) {
							var d = $.parseJSON(params.data);
							data = {
								"id": "4f84b22ade94e65caf000010",
								"participant": {
									id: "1",
									email: "juanpgaviria@gmail.com",
									username: "juanpgaviria@gmail.com",
									first_name: "juan",
									last_name: "gaviria",
									"resource_uri": "/api/v1/users/1/",	
								},
								"isProject": false,
								"name": d.name,
								"description": d.description, 
								"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000010/",	
							};
					}
					else if (params.url.match('.*projects/[A-Za-z0-9]+/$') != null) {
							var d = $.parseJSON(params.data);
							data = {
								"id": "4f84b22ade94e65caf000010",
								"owner": {
									id: "1",
									email: "juanpgaviria@gmail.com",
									username: "juanpgaviria@gmail.com",
									first_name: "juan",
									last_name: "gaviria",
									"resource_uri": "/api/v1/users/1/",	
								},
								"name": d.name,
								"team": [],
								"description": d.description, 
								"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000010/",	
							};
					}else if (params.url.match('.*events/[A-Za-z0-9]+/$') != null) {
						var d = $.parseJSON(params.data);
						data = {
							"id": "4f84b22ade94e65caf000011",
							'resource_uri': "/api/v1/events/4f84b22ade94e65caf000011",
							'name': d.name,
							'email': d.email,
							'twitter': d.twitter,
							'description': d.description,
							'url': d.url,
							'start_date': d.start_date,
							'end_date': d.end_date,
							'cover': d.cover,
						};
					}

		}
		else if (params.type == 'DELETE' || params.type == 'delete') {
			if (params.url.match('.*invitations/[A-Za-z0-9]+/$') != null) {
				data = {
				};
				response = data;
			}
			
		} 
		if (data == ""){
			log("fallback to $.ajax");
			return ajax(params);
		}
	params.success(data);
};
  
