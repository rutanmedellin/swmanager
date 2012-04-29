describe("Invitations pending for Admin Users view", function (){
	beforeEach(function (){
		// set dom fixture
		setFixtures('<div class="invitations-pending"></div>');
		
		// create collection of invitations pending
		this.invitations = new App.Collections.Invitations([
			{
				"id": "4f84b22ade94e65caf000010",
				"email": "juanpgaviria@gmail.com", 
				"role": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/", 
			},
			{
				"id": "4f84b22ade94e65caf000011",
				"email": "castillobuiles@gmail.com", 
				"role": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/", 
			},
			{
				"id": "4f84b22ade94e65caf000012",
				"email": "manuelzs@gmail.com", 
				"role": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000012/", 
			}
		]);
		
		this.view = new App.Views.Invitations({el: ".invitations-pending", collection: this.invitations, role: "admin"});
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with invitations-pending class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("invitations-pending");
		});
    
  	});
	
	describe("Render the invitation admin list", function (){
		
		it("should be 3 invitations pending", function (){
			expect($(".invitation", this.view.el).length).toEqual(3);
		});		
	});
	
	describe("When method resend is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.invitation_data = {
				"id": "4f84b22ade94e65caf000010",
				"email": "juanpgaviria@gmail.com", 
				"role": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/",
			};
		  
			this.server.respondWith(
				"PUT", 
				"/api/v1/invitations/4f84b22ade94e65caf000010",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.invitation_data)
				]
			);
			
			this.invitation = this.view.collection.get("4f84b22ade94e65caf000010");
			this.invitationStub = sinon.stub(this.invitation, "save").returns(this.invitation);
			
			this.invitation_view = new App.Views.Invitation({model: this.invitation});
			this.invitation_view.resend();
						
		});
		
		afterEach(function (){
			this.invitationStub.restore();
			this.server.restore();
		});
		
		it("Should send a put to the invitation with resend param equal true", function(){
			expect(this.invitationStub.calledOnce).toEqual(true);
			expect(this.invitationStub.getCall(0).args[0].resend).toEqual(true);
		});
	});

	describe("When method cancel is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.invitation_data = {
			};
		  
			this.server.respondWith(
				"PUT", 
				"/api/v1/invitations/4f84b22ade94e65caf000010",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.invitation_data)
				]
			);
			
			this.invitation = this.view.collection.get("4f84b22ade94e65caf000010");
			this.invitationStub = sinon.stub(this.invitation, "destroy").returns(this.invitation);
			
			this.invitation_view = new App.Views.Invitation({model: this.invitation});
			this.invitation_view.cancel();
						
		});
		
		afterEach(function (){
			this.invitationStub.restore();
			this.server.restore();
		});
		
		it("Should send a put to the invitation with resend param equal true", function(){
			expect(this.invitationStub.calledOnce).toEqual(true);
		});
	});


});
