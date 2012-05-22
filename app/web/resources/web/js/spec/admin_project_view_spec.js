describe("Admin Project view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		$.fn.tweet = function (options) {};
		// project data
		this.project_data = {
			"id":123, 
			"name": "test",
			"owner": {
				id: "4",
				email: "elizabeth.ramirez@rutanmedellin.org",
				username: "elizabeth.ramirez@rutanmedellin.org",
				first_name: "Eliza",
				last_name: "Ramirez",
				"resource_uri": "/api/v1/users/4/",	
			},
			"team": [{
					id: "2",
					email: "castillobuiles@gmail.com",
					username: "castillobuiles@gmail.com",
					first_name: "Sebastian",
					last_name: "Castillo",
					"resource_uri": "/api/v 1/users/2/",	
				},{
					id: "3",
					email: "manuelzs@gmail.com",
					username: "manuelzs@gmail.com",
					first_name: "Manuel",
					last_name: "Zapata",
					"resource_uri": "/api/v1/users/3/",	
				}],
			"twitter": "test",
			"url": "http://test.com",
			"votes": 11,			
			"description": "test",
			"resource_uri": "/api/v1/project/123"
		};
	  
	  	this.project = new App.Models.Project();
		this.project.set(this.project_data);
		this.project.id = this.project_data.id;
		this.view = new App.Views.AdminProject({el: ".admin-content", model: this.project});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("When render the project", function (){
		it("Should render the name of the project in to <h1>", function (){
			expect($("h1", this.view.el).html()).toEqual(this.project_data.name);
		});
		
		it("Should render the team members of the project in to .team div", function (){
			expect($(".member", this.view.el).length).toEqual(3);
		});				
		
		it("Should render the description of the project in to <p>", function (){
			expect($("p", ".description").html()).toMatch(this.project_data.description);
		});				

		describe("When admin user is seen the project", function (){
			beforeEach(function (){
				Data.Models.account = new App.Models.Account({
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "admins",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
				Data.Models.account.id = 1;
				this.view = new App.Views.AdminProject({el: ".admin-content", model: this.project});
			});	
					
			it("Should render the edit button", function (){
				expect($(".edit", this.view.el).length).toEqual(1);
			});
		});
		
		describe("When participant is seen the idea", function (){
			beforeEach(function (){
				Data.Models.account = new App.Models.Account({
					'id': 1,
					'resource_uri': "/api/v1/users/1",
					'username': "juanpgaviria",
					'first_name': "juan",
					'last_name': "gaviria",
					'email': "juanpgaviria@gmail.com",
					'twitter': "@juanpgaviria",
					'role': "participants",
					'bio': "hola mundo",
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
				Data.Models.account.id = 1;
				this.view = new App.Views.AdminProject({el: ".admin-content", model: this.project});
			});
			
			it("Should render the vote button", function (){
				expect($(".vote", this.view.el).length).toEqual(1);
			});	
		})
		
	});		
	
});
