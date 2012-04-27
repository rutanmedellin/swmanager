describe("User Profile View", function (){
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
		
		this.view = new App.Views.UserProfileView({el: ".admin-content", model: this.account});
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the user profile", function (){
		
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
		
		it("should be list of ideas of the user", function (){
			expect($(".user-ideas", this.view.el).length).toEqual(1);
		});		
		
		it("should be the list of projects of the user", function (){
			expect($(".user-projects", this.view.el).length).toEqual(1);
		});		
		
		describe("When the user is seen his user profile", function (){
			it("should have an edit button", function (){
				expect($(".edit-profile", this.view.el).length).toEqual(1);
			});		
			
		});
		
		describe("When admin user is seen user profile", function (){
			beforeEach(function (){
				Data.Models.account = new App.Models.Account({
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "participant",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
				Data.Models.account.id = 1;
				this.view.render();
			});
			it("should have an edit button", function (){
				expect($(".edit-profile", this.view.el).length).toEqual(1);
			});		
		});
	});
	
});
