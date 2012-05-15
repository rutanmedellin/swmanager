describe("Idea Edit view", function (){
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
	  
	  	this.idea = new App.Models.Idea();
		this.idea.set(this.idea_data);
		this.idea.id = this.idea_data.id;
		this.view = new App.Views.AdminIdeaEdit({el: ".admin-content", model: this.idea});		
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
		it("should render a div with a form inside", function (){
			expect($("form", this.el).length).toEqual(1);
		});
		
		it("should render a input with participant as name and type text", function (){
			expect($("input[name=participant]", this.el).length).toEqual(1);
			expect($("input[name=participant]", this.el).attr("type")).toEqual("hidden");
		});
		
		it("should render a input with name as name and type text", function (){
			expect($("input[name=name]", this.el).length).toEqual(1);
			expect($("input[name=name]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a textarea with description as name", function (){
			expect($("textarea[name=description]", this.el).length).toEqual(1);
		});
		
		it("should render a button with Create as text and create class ", function (){
			expect($(".save", this.el).length).toEqual(1);
			expect($(".save", this.el).html()).toEqual("Save");
		});						
	});		
	
});
