describe("Users collection", function (){
	beforeEach(function() {
		this.userModelStub = sinon.stub(window.App.Models, "User");
		this.user1 = new Backbone.Model({
	  		id: 5, 
	  		username: "juanpgaviria",
			email: "juanpgaviria@gmail.com",
			role: "admin",
			first_name: "juan pablo",
			last_name: "gaviria",
			ideas: "/api/v1/ideas/?user=5", 
			projects: "/api/v1/projects/?user=5"			
		});
		this.user2 = new Backbone.Model({
	  		id: 6, 
	  		username: "castillobuiles",
			email: "castillobuiles@gmail.com",
			role: "admin",
			first_name: "Sebastian",
			last_name: "Castillo",
			ideas: "/api/v1/ideas/?user=6", 
			projects: "/api/v1/projects/?user=6"
		});
		this.userModelStub.returns(this.user1);
		this.users = new App.Collections.Users();
		this.users.model = App.Models.User; // reset model relationship to use stub
		this.users.add({
		  	id: 5, 
			username: "castillobuiles",
			email: "castillobuiles@gmail.com",
			role: "admin",
			first_name: "Sebastian",
			last_name: "Castillo",
		});
	});
	
	afterEach(function() {
		this.userModelStub.restore();
	});
	
	it("should add a model", function() {
		expect(this.users.length).toEqual(1);
	});
	
	describe("When fetching users", function (){
		beforeEach(function() {
			//start fake server
			this.server = sinon.fakeServer.create();
			
			// set fixtures
			
			this.fixtures = {
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
			
			// fake response
			this.server.respondWith(
			    "GET",
			    "/api/v1/users",
			    [
			      200,
			      {"Content-Type": "application/json"},
			      JSON.stringify(this.fixtures)
			    ]
			);
				
			// invitation collection instance
			this.users = new App.Collections.Users();		
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("should make the correct request", function() {
			this.users.fetch();
			expect(this.server.requests.length)
				.toEqual(1);
			expect(this.server.requests[0].method)
				.toEqual("GET");
			expect(this.server.requests[0].url)
				.toEqual("/api/v1/users");
		});
		
		it("should parse invitations from the response", function (){
			this.users.fetch();
			this.server.respond();
			Data.Collections.users = this.users;
			expect(this.users.length)
				.toEqual(this.fixtures.objects.length);
			expect(this.users.get("5").get('email')).
				toEqual(this.fixtures.objects[0].email);
		});
		
	});
	
});
