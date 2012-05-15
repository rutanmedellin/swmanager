describe("Ideas collection", function (){
	beforeEach(function() {
		this.ideaModelStub = sinon.stub(window.App.Models, "Idea");
		this.idea1 = new Backbone.Model({
	  		id: 1, 
			participant: {
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
		this.idea2 = new Backbone.Model({
	  		id: 2, 
			participant: {
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
		this.ideaModelStub.returns(this.idea1);
		this.ideas = new App.Collections.Ideas();
		this.ideas.model = App.Models.Idea; // reset model relationship to use stub
		this.ideas.add({
		  	id: 2, 
			participant: {
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
		this.ideaModelStub.restore();
	});
	
	it("should add a model", function() {
		expect(this.ideas.length).toEqual(1);
	});
	
	describe("When fetching ideas", function (){
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
							participant: {
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
							resource_uri: "/api/v1/ideas/1/"			
						},
						{
					  		id: 2, 
							participant: {
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
							resource_uri: "/api/v1/ideas/2/"
						}
				]
			};
			
			// fake response
			this.server.respondWith(
			    "GET",
			    "/api/v1/ideas/",
			    [
			      200,
			      {"Content-Type": "application/json"},
			      JSON.stringify(this.fixtures)
			    ]
			);
				
			// ideas collection instance
			this.ideas = new App.Collections.Ideas();		
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("should make the correct request", function() {
			this.ideas.fetch();
			expect(this.server.requests.length)
				.toEqual(1);
			expect(this.server.requests[0].method)
				.toEqual("GET");
			expect(this.server.requests[0].url)
				.toEqual("/api/v1/ideas/");
		});
		
		it("should parse ideas from the response", function (){
			this.ideas.fetch();
			this.server.respond();
			Data.Collections.ideas = this.ideas;
			expect(this.ideas.length)
				.toEqual(this.fixtures.objects.length);
			expect(this.ideas.get("1").get('participant').id).
				toEqual(this.fixtures.objects[0].participant.id);
		});
		
		it("should order models by votes", function() {
			this.ideas.fetch();
			this.server.respond();
			expect(this.ideas.at(0).id).toEqual(2);
			expect(this.ideas.at(1).id).toEqual(1);
		});
		
	});
	
});
