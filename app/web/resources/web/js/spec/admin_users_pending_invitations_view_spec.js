describe("Invitations pending for Admin Users view", function (){
	beforeEach(function (){
		// set dom fixture
		setFixtures('<div class="invitations-pending"></div>');
		
		// create collection of invitations pending
		this.invitations = new App.Collections.Invitations([
			{
				"id": "4f84b22ade94e65caf000010",
				"email": "juanpgaviria@gmail.com", 
				"type": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000010/", 
			},
			{
				"id": "4f84b22ade94e65caf000011",
				"email": "castillobuiles@gmail.com", 
				"type": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000011/", 
			},
			{
				"id": "4f84b22ade94e65caf000012",
				"email": "manuelzs@gmail.com", 
				"type": "admin", 
				"resource_uri": "/api/v1/users/4f84b22ade94e65caf000012/", 
			}
		]);
		
		this.view = new App.Views.Invitations({el: ".invitations-pending", collection: this.invitations, type: "admin"});
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
/*
	
	describe("When method invite is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.invitation_data = {
				"id":123, 
				"email": "juanpgaviria@gmail.com",
				"role": "admin"
			};
		  
			this.server.respondWith(
				"POST", 
				"/api/v1/invitations",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.invitation_data)
				]
			);
			
			this.invitation = new App.Models.Invitation();
			this.invitationStub = sinon.stub(window.App.Models, "Invitation")
				.returns(this.invitation);
				
			this.spy_save = sinon.spy(this.invitation, "save");
			
			$("input[name=email]", this.el).val("juanpgaviria@gmail.com");
			this.view.invite();
			
		});
		
		afterEach(function (){
			this.server.restore();
			this.invitationStub.restore();
		});
		
		it("Should create an invitation model and save it", function(){
			expect(this.invitationStub.calledOnce).toEqual(true);
			expect(this.spy_save.calledOnce).toEqual(true);
			expect(this.spy_save.getCall(0).args[0].email).toEqual("juanpgaviria@gmail.com");
			expect(this.spy_save.getCall(0).args[0].role).toEqual("admin");			
		});
	});
	
	describe("Render the admin users list", function (){
		
	});

*/
});
