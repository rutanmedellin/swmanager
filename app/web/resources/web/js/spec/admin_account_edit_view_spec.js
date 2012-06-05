describe("Edit User Profile View", function (){
beforeEach(function (){
		// set dom fixture
		setFixtures('<div class="admin-content"></div>');
		
		// create collection of invitations pending
		this.account = new App.Models.Account(
			{
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "admin",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
			}
		);
		
		Data.Models.account = new App.Models.Account({
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "admin",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
		});
		Data.Models.account.id = 1;
		
		this.view = new App.Views.UserProfileEditView({el: ".admin-content", model: this.account});
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the user profile edit form", function (){
		
		it("should be the avatar from gravatar", function (){
			expect($(".avatar", this.view.el).length).toEqual(1);
		});
		
		it("should be the user email", function (){
			expect($(".email", this.view.el).length).toEqual(1);
		});
		
		it("should be the user twitter account", function (){
			expect($(".twitter", this.view.el).length).toEqual(1);
		});
		
		it("should be the name(first and last)", function (){
			expect($(".name", this.view.el).length).toEqual(1);
		});
		
		it("should be the participant type", function (){
			expect($(".participant_type", this.view.el).length).toEqual(1);
		});		
		
		describe("When admin user is seen the user profile edit form", function (){
			beforeEach(function (){
				// session data
				this.user_data = {
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "cambio",
					'last_name': "cambio",
					'email': "juanpgaviria@gmail.com",
					'twitter': "cambio",
					'role': "admins",
					'bio': "cambio",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				};
			  	Data.Models.account = new App.Models.Account(this.user_data);
				this.view.initialize();
			});
			
			afterEach(function (){
			});
						
			it("should render a select role form", function (){				
				expect($(".role", this.view.el).length).toEqual(1);
			});
		});
		describe("When the click save button", function (){
			beforeEach(function (){
				this.server = sinon.fakeServer.create();
				
				// session data
				this.user_data = {
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "cambio",
					'last_name': "cambio",
					'email': "juanpgaviria@gmail.com",
					'twitter': "cambio",
					'role': "admins",
					'bio': "cambio",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				};
			  
				this.server.respondWith(
					"PUT", 
					"/api/v1/users/1",
					[200, {"Content-Type": "application/json"},
					JSON.stringify(this.user_data)
					]
				);
				
				this.accountStub = sinon.stub(this.account, "save").returns(this.account);
				this.view.save();
			});
			
			afterEach(function (){
				this.accountStub.restore();
				this.server.restore();
			});
						
			it("should save the user profile", function (){				
				expect(this.accountStub.calledOnce).toEqual(true);
			});		
			
		});
				
		
	});
	
});
