describe("Projects collection", function (){
	beforeEach(function() {
		this.projectModelStub = sinon.stub(window.App.Models, "Project");
		this.project1 = new Backbone.Model({
	  		id: 1, 
			owner: {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
			name: "test", 
			description: "test"			
		});
		this.projects2 = new Backbone.Model({
	  		id: 2, 
			owner: {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
			name: "test", 
			description: "test"			
		});
		this.projectModelStub.returns(this.project1);
		this.projects = new App.Collections.Projects();
		this.projects.model = App.Models.Project; // reset model relationship to use stub
		this.projects.add({
		  	id: 2, 
			owner: {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
			name: "test", 
			description: "test"			
		});
	});
	
	afterEach(function() {
		this.projectModelStub.restore();
	});
	
	it("should add a model", function() {
		expect(this.projects.length).toEqual(1);
	});
	
	describe("When fetching projects", function (){
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
					  		id: 1, 
							owner: {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							name: "test",
							votes: 0, 
							description: "test",
							resource_uri: "/api/v1/projects/1/"			
						},
						{
					  		id: 2, 
							owner: {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							name: "test", 
							votes: 11,
							description: "test",
							resource_uri: "/api/v1/projects/2/"
						}
				]
			};
			
			// fake response
			this.server.respondWith(
			    "GET",
			    "/api/v1/projects/",
			    [
			      200,
			      {"Content-Type": "application/json"},
			      JSON.stringify(this.fixtures)
			    ]
			);
				
			// projects collection instance
			this.projects = new App.Collections.Projects();		
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("should make the correct request", function() {
			this.projects.fetch();
			expect(this.server.requests.length)
				.toEqual(1);
			expect(this.server.requests[0].method)
				.toEqual("GET");
			expect(this.server.requests[0].url)
				.toEqual("/api/v1/projects/");
		});
		
		it("should parse projects from the response", function (){
			this.projects.fetch();
			this.server.respond();
			Data.Collections.projects = this.projects;
			expect(this.projects.length)
				.toEqual(this.fixtures.objects.length);
			expect(this.projects.get("1").get('owner').id).
				toEqual(this.fixtures.objects[0].owner.id);
		});
		
		it("should order models by votes", function() {
			this.projects.fetch();
			this.server.respond();
			expect(this.projects.at(0).id).toEqual(2);
			expect(this.projects.at(1).id).toEqual(1);
		});
		
	});
	
});
