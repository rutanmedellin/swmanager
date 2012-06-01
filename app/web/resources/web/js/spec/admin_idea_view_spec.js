describe("Admin Idea view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		
		// idea data
		this.idea_data = {
			"id":123, 
			"name": "test",
			"participant": {
				id: "4",
				email: "elizabeth.ramirez@rutanmedellin.org",
				username: "elizabeth.ramirez@rutanmedellin.org",
				first_name: "Eliza",
				last_name: "Ramirez",
				"resource_uri": "/api/v1/users/4/",	
			},
			"description": "test",
			"resource_uri": "/api/v1/ideas/123"
		};
		
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
					'votes': [],
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
			  
	  	this.idea = new App.Models.Idea();
		this.idea.set(this.idea_data);
		this.idea.id = this.idea_data.id;
		this.view = new App.Views.AdminIdea({el: ".admin-content", model: this.idea});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("When render the idea", function (){
		it("Should render the name of the idea in to <h1>", function (){
			expect($("h1", this.view.el).html()).toEqual(this.idea_data.name);
		});
		
		it("Should render the participant of the idea in to <h6>", function (){
			expect($("h6", this.view.el).html()).toMatch(this.idea_data.participant.first_name);
		});				
		
		it("Should render the description of the idea in to <p>", function (){
			expect($("p", this.view.el).html()).toMatch(this.idea_data.description);
		});				

		describe("When admin user is seen the idea", function (){
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
					'votes': [],
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
				Data.Models.account.id = 1;
				this.view = new App.Views.AdminIdea({el: ".admin-content", model: this.idea});
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
					'votes': [],
					'ideas': "/api/v1/ideas/?user=1",
					'projects': "/api/v1/projects/?user=1"
				});
				Data.Models.account.id = 1;
				this.view = new App.Views.AdminIdea({el: ".admin-content", model: this.idea});
			});
			
			it("Should render the vote button", function (){
				expect($(".vote", this.view.el).length).toEqual(1);
			});	
		})
		
	});		
	
});
