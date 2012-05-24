describe("Event Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.event = new App.Models.Event();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.event.url == "function" && Data.Models.event.url();
			if (!url){
				url = typeof Data.Models.event.url == "string" && Data.Models.event.url;
			}
			expect(url).toEqual('/api/v1/events/');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.event = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.event.id = 1;
	      	url = typeof Data.Models.event.url == "function" && Data.Models.event.url();
			if (!url){
				url = typeof Data.Models.event.url == "string" && Data.Models.event.url;
			}
			expect(url).toEqual('/api/v1/events/1/');
	    });
	});
	
	describe("When creating a new event", function(){
		it("should not change when attribute url is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.event.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				name: "test",
			}
			Data.Models.event.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute name is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.event.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				url: "http://medellin.startupweekend.org",
			};
			Data.Models.event.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should change when setting the name and url attributes", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.event.bind("error", spy);
			
			// set with required fields
			data = {
				url: "http://medellin.startupweekend.org",
				name: "test",
			};
			Data.Models.event.set(data); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.event_data = {
				"id": "4f84b22ade94e65caf000011",
				'resource_uri': "/api/v1/events/4f84b22ade94e65caf000011",
				'name': "Startup Weekend Medellín",
				'email': "medellin@startupweekend.org",
				'twitter': "SWCol",
				'description': "Hola mundo",
				'url': 'http://medellin.startupweekend.org',
				'start_date': 23345342334,
				'end_date': 23345342334,
				'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",		 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/events/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.event_data)
				]
			);
			
			// set data and save to create the post request
			//Data.Models.idea.bind('change', callback);
			
			data = {
				'name': "Startup Weekend Medellín",
				'email': "medellin@startupweekend.org",
				'twitter': "SWCol",
				'description': "Hola mundo",
				'url': 'http://medellin.startupweekend.org',
				'start_date': 23345342334,
				'end_date': 23345342334,
				'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",		 
			};
			Data.Models.event.set(data);
			
			Data.Models.event.save({}, {success: callback});
			
			// fake server response
			this.server.respond(); 
			a = callback;
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(this.event_data.id);
		});
	});	
});