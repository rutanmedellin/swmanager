describe("Admin Ideas view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		this.view = new App.Views.AdminIdeas({el: ".admin-content"});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the new idea form", function (){
		it("should render a div with class idea-form", function (){
			expect($(".idea-form", this.el).length).toEqual(1);
		});
		
		it("should render a input with participante as name and type text", function (){
			expect($("input[name=participant]", this.el).length).toEqual(1);
			expect($("input[name=participant]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a input with name as name and type text", function (){
			expect($("input[name=name]", this.el).length).toEqual(1);
			expect($("input[name=name]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a textarea with description as name", function (){
			expect($("textarea[name=description]", this.el).length).toEqual(1);
		});
		
		it("should render a button with Create as text and create class ", function (){
			expect($(".create", this.el).length).toEqual(1);
			expect($(".create", this.el).html()).toEqual("Create");
		});
		
	});
	
	describe("When method create is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.idea_data = {
				"id":123, 
				"name": "test",
				"participant": "1",
				"description": "test",
				"resource_uri": "/api/v1/ideas/123"
			};
		  
			this.server.respondWith(
				"POST", 
				"/api/v1/ideas",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.idea_data)
				]
			);
			
			this.idea = new App.Models.Idea();
			this.ideaStub = sinon.stub(window.App.Models, "Idea")
				.returns(this.idea);
				
			this.spy_save = sinon.spy(this.idea, "save");
			
			$("input[name=name]", this.el).val("test");
			$("input[name=participant]", this.el).val("1");
			$("textarea[name=description]", this.el).val("test");
			this.view.create();
			
		});
		
		afterEach(function (){
			this.server.restore();
			this.ideaStub.restore();
		});
		
		it("Should create an invitation model and save it", function(){
			expect(this.ideaStub.calledOnce).toEqual(true);
			expect(this.spy_save.calledOnce).toEqual(true);
			expect(this.spy_save.getCall(0).args[0].name).toEqual("test");
			expect(this.spy_save.getCall(0).args[0].participant).toEqual("1");
			expect(this.spy_save.getCall(0).args[0].description).toEqual("test");			
		});
	});
	
	describe("Render the ideas list", function (){
		
	});
});
