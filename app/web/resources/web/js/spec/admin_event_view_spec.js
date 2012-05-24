describe("Event settings View", function (){
beforeEach(function (){
		// set dom fixture
		setFixtures('<div class="admin-content"></div>');
		
		this.event_data = {
					'id': 1,
					'resource_uri': "/api/v1/events/1",
					'name': "Startup Weekend Medellín",
					'email': "medellin@startupweekend.org",
					'twitter': "SWCol",
					'description': "Hola mundo",
					'url': 'http://medellin.startupweekend.org',
					'start_date': 23345342334,
					'end_date': 23345342334,
					'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
				};
		
		Data.Models.event = new App.Models.Event(this.event_data);
		
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
		
		this.view = new App.Views.AdminEvent({el: ".admin-content", model: Data.Models.event});
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the site edit form", function (){
		
		it("should be the cover from gravatar", function (){
			expect($(".cover", this.view.el).length).toEqual(1);
		});
		
		it("should be the event contact email", function (){
			expect($(".email", this.view.el).length).toEqual(1);
		});
		
		it("should be the event twitter account", function (){
			expect($(".twitter", this.view.el).length).toEqual(1);
		});
		
		it("should be the name of the event", function (){
			expect($(".name", this.view.el).length).toEqual(1);
		});
		
		it("should be the url of the event", function (){
			expect($(".url", this.view.el).length).toEqual(1);
		});
		
		it("should be the description of the event", function (){
			expect($(".description", this.view.el).length).toEqual(1);
		});
		
		it("should be the start date-time of the event", function (){
			expect($(".start", this.view.el).length).toEqual(1);
		});				
		
		it("should be the end date-time of the event", function (){
			expect($(".end", this.view.el).length).toEqual(1);
		});
		
		describe("When the click save button", function (){
			beforeEach(function (){
				this.server = sinon.fakeServer.create();
					
				if (this.view.model.isNew()) {
					this.server.respondWith(
						"POST", 
						"/api/v1/events/1", [200, {
						"Content-Type": "application/json"
					}, JSON.stringify(this.event_data)]);
				}else{
					this.server.respondWith(
						"PUT", 
						"/api/v1/events/1",
						[200, {"Content-Type": "application/json"},
						JSON.stringify(this.event_data)
						]
					);

				}
				
				this.eventStub = sinon.stub(Data.Models.event, "save").returns(Data.Models.event);
				this.view.save();
			});
			
			afterEach(function (){
				this.eventStub.restore();
				this.server.restore();
			});
						
			it("should save the site settings", function (){				
				expect(this.eventStub.calledOnce).toEqual(true);
			});		
			
		});
				
		
	});
	
});
