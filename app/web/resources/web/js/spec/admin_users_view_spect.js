describe("Admin Users view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		this.view = new App.Views.AdminUsers({el: ".admin-content"});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the invitation form", function (){
		it("should render a div with class invitation-form", function (){
			expect($(".invitation-form", this.el).length).toEqual(1);
		});
		
		it("should render a input with email as name and type text", function (){
			expect($("input[name=email]", this.el).length).toEqual(1);
			expect($("input[name=email]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a input with role as name and type hidden and value admin", function (){
			expect($("input[name=role]", this.el).length).toEqual(1);
			expect($("input[name=role]", this.el).attr("type")).toEqual("hidden");
			expect($("input[name=role]", this.el).val()).toEqual("admins");
		});
		
		it("should render a button with Invite as text and invite class ", function (){
			expect($(".invite", this.el).length).toEqual(1);
			expect($(".invite", this.el).html()).toEqual("Invite");
		});
		
		it("should render a div with class admin-users-list", function (){
			expect($(".admin-users-list", this.el).length).toEqual(1);
		});
		
	});
	
	describe("When method invite is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.invitation_data = {
				"id":123, 
				"email": "juanpgaviria@gmail.com",
				"role": "admins"
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
			expect(this.spy_save.getCall(0).args[0].role).toEqual("admins");			
		});
	});
	
	describe("Render the admin users list", function (){
		
	});
});
