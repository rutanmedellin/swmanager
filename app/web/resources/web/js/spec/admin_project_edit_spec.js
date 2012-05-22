describe("Admin Project Edit", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		
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
			"description": "test",
			"resource_uri": "/api/v1/project/123"
		};
	  
	  	this.project = new App.Models.Project();
		this.project.set(this.project_data);
		this.project.id = this.project_data.id;
		this.view = new App.Views.AdminProjectEdit({el: ".admin-content", model: this.project});		
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
		it("should render a div with a form inside", function (){
			expect($("form", this.el).length).toEqual(1);
		});
		
		it("should render a input with participant as name and type text", function (){
			expect($("input[name=owner]", this.el).length).toEqual(1);
			expect($("input[name=owner]", this.el).attr("type")).toEqual("hidden");
		});
		
		it("should render a input with name as name and type text", function (){
			expect($("input[name=name]", this.el).length).toEqual(1);
			expect($("input[name=name]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a textarea with description as name", function (){
			expect($("textarea[name=description]", this.el).length).toEqual(1);
		});
		
		it("should be the project twitter account", function (){
			expect($(".twitter", this.view.el).length).toEqual(1);
		});
		
		it("should be the project url address", function (){
			expect($(".url", this.view.el).length).toEqual(1);
		});
		
		it("should be the project add team member input", function (){
			expect($("input[name=possible-member]", this.view.el).length).toEqual(1);
		});
		
		it("should be the project image from twitter account", function (){
			expect($(".image", this.view.el).length).toEqual(1);
		});
		
		it("should render a button with Save as text and save class ", function (){
			expect($(".save", this.el).length).toEqual(1);
			expect($(".save", this.el).html()).toEqual("Save");
		});						
	});			
});
