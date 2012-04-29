describe("Invition pending collection", function (){
	beforeEach(function() {
		this.invitationStub = sinon.stub(window.App.Models, "Invitation");
		this.adminInvitation = new Backbone.Model({
	  		id: 5, 
	  		code: "Qweasdawe2343",
			email: "juanpgaviria@gmail.com",
			type: "admin"
		});
		this.participantInvitation = new Backbone.Model({
	  		id: 5, 
	  		code: "Qweasdawe2343",
			email: "juanpgaviria@hotmail.com",
			type: "participant"
		});
		this.invitationStub.returns(this.adminInvitation);
		this.invitations = new App.Collections.Invitations();
		this.invitations.model = App.Models.Invitation; // reset model relationship to use stub
		this.invitations.add({
		  	id: 5, 
			email: "juanpgaviria@hotmail.com",
			type: "admin"
		});
	});
	
	afterEach(function() {
		this.invitationStub.restore();
	});
	
	it("should add a model", function() {
		expect(this.invitations.length).toEqual(1);
	});
	
	describe("When fetching invitations", function (){
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
					 "total_count": 1
				}, 
				"objects": [
					 	{
							"id": "4f84b22ade94e65caf000010",
							"email": "juanpgaviria@gmail.com", 
							"type": "admin", 
							"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/", 
						}
				]
			};
			
			// fake response
			this.server.respondWith(
			    "GET",
			    "/api/v1/invitations",
			    [
			      200,
			      {"Content-Type": "application/json"},
			      JSON.stringify(this.fixtures)
			    ]
			);
				
			// invitation collection instance
			this.invitations = new App.Collections.Invitations();		
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("should make the correct request", function() {
			this.invitations.fetch();
			expect(this.server.requests.length)
				.toEqual(1);
			expect(this.server.requests[0].method)
				.toEqual("GET");
			expect(this.server.requests[0].url)
				.toEqual("/api/v1/invitations");
		});
		
		it("should parse invitations from the response", function (){
			this.invitations.fetch();
			this.server.respond();
			Data.Collections.invitations = this.invitations;
			expect(this.invitations.length)
				.toEqual(this.fixtures.objects.length);
			expect(this.invitations.get("4f84b22ade94e65caf000010").get('email')).
				toEqual(this.fixtures.objects[0].email);
		});
		
	});
	
});
