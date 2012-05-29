describe("Public Participants view", function (){
	beforeEach(function (){
		setFixtures('<div class="container" id="wrapper"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		
		this.view = new App.Views.PublicParticipants({el: "#wrapper"});		
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
			this.participants_collections = {
					"meta": {
						"limit": 20,
						 "next": null, 
						 "offset": 0, 
						 "previous": null, 
						 "total_count": 3
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

			this.server.respondWith(
				"GET", 
				"/api/v1/users/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.participants_collections)
				]
			);
			
			this.participants = new App.Collections.Users();
			this.participants.fetch();
			this.server.respond();
								
			this.view.participants = new App.Views.AdminUsersList({el: "#list", collection: this.participants, role: "participants"});
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("Should render 3 participants", function (){
			expect($(".user", this.view.participants.el).length).toEqual(this.participants_collections.objects.length);
		});
		
		describe("Every participant item", function (){
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
				
				this.participant = this.participants.get(this.participants_collections.objects[0].id);
				this.view.participants.participant = new App.Views.AdminUserView({model: this.participant});
				this.view.participants.participant.render();
			});			
			
			it("should has a avatar image", function (){
				expect($(".avatar", this.view.participants.participant.el).length).toEqual(1);
			});
			
			it("should has a info div", function (){
				expect($(".info", this.view.participants.participant.el).length).toEqual(1);
			});
		});
			
	});
});
