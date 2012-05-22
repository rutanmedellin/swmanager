describe("Public Projects view", function (){
	beforeEach(function (){
		setFixtures('<div class="container" id="wrapper"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		
		this.view = new App.Views.PublicProjects({el: "#wrapper"});		
	});
	
	afterEach(function (){
		
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("container");
		});
    
  	});
	
	describe("Render the projects list", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// projects data
			this.projects_collections = {
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
							"team": [],
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
							"team": [],
							"description": "test",
							"resource_uri": "/api/v1/projects/4f84b22ade94e65caf000011/",
						}]
					};
		  
			this.server.respondWith(
				"GET", 
				"/api/v1/projects/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.projects_collections)
				]
			);
			
			this.projects = new App.Collections.Projects();
			this.projects.fetch();
			this.server.respond();
						
			this.view.projects = new App.Views.Projects({el: ".participants-projects", collection: this.projects});				
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("Should render 4 projects", function (){
			expect($(".project", this.view.projects.el).length).toEqual(this.projects_collections.objects.length);
		});
		
		describe("Every project item", function (){
			beforeEach(function (){
				Data.Models.account = new App.Models.Account({
					'id': 8,
					'resource_uri': "/api/v1/users/8",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "participants",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=8",
					'projects': "/api/v1/projects/?user=8"
				});
				Data.Models.account.id = 8;
				
				this.project = this.projects.get(this.projects_collections.objects[0].id);
				this.view.projects.project = new App.Views.Project({model: this.project});
				this.view.projects.project.render();
			});			
			
			it("should has a vote button", function (){
				expect($(".vote", this.view.projects.project.el).length).toEqual(1);
			});
			
			describe("When projects vote method is call", function (){
				
			});
		});
			
	});
});
