describe("Admin Users list view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-users-list"></div>');
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

		this.users = new App.Collections.Users([
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
			]);
		
		this.view = new App.Views.AdminUsersList({el: ".admin-users-list", collection: this.users, role: "admin"});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-users-list class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-users-list");
		});
    
  	});
	
	describe("Render the invitation admin list", function (){
		
		it("should be 2 admin users", function (){
			expect($(".user", this.view.el).length).toEqual(2);
		});		
	});

	
	
	
});
