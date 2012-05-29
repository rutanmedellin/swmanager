describe("Home View", function (){
beforeEach(function (){
		// set dom fixture
		
		$.fn.modal = function (options) {};
		$.fn.datepicker = function (options) {};
		$.fn.tweet = function (options) {};
		$.fn.countdown = function (options) {};
		
		setFixtures('<div class="container" id="wrapper"></div>');
		
		this.event_data = {
					'id': 1,
					'resource_uri': "/api/v1/events/1",
					'name': "Startup Weekend Medellín",
					'email': "medellin@startupweekend.org",
					'twitter': "SWCol",
					'description': "Hola mundo",
					'url': 'http://medellin.startupweekend.org',
					'start_date': "2012-06-08T17:30:00",
					'end_date': "2012-06-10T21:30:00",
					'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
				};
		
		this.event_model = new App.Models.Event(this.event_data);
		
		this.view = new App.Views.Home({el: "#wrapper", model: this.event_model});
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("container");
		});
    
  	});
	
	describe("Render the home page", function (){
		
		it("should be the cover from gravatar", function (){
			expect($(".cover", this.view.el).length).toEqual(1);
		});
		
		it("should be the event contact email", function (){
			expect($(".email", this.view.el).length).toEqual(1);
		});
		
		it("should be the event twitter account", function (){
			expect($(".twitter", this.view.el).length).toEqual(1);
		});
		
		it("should be the url of the event", function (){
			expect($(".url", this.view.el).length).toEqual(1);
		});
		
		it("should be the description of the event", function (){
			expect($(".description", this.view.el).length).toEqual(1);
		});
		
		it("should be the countdown for the event", function (){
			expect($("#clock", this.view.el).length).toEqual(1);
		});				
		
	});
	
});
