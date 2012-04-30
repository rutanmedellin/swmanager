describe("Idea Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.idea = new App.Models.Idea();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.idea.url == "function" && Data.Models.idea.url();
			if (!url){
				url = typeof Data.Models.idea.url == "string" && Data.Models.idea.url;
			}
			expect(url).toEqual('/api/v1/ideas');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.idea = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.idea.id = 1;
	      	url = typeof Data.Models.idea.url == "function" && Data.Models.idea.url();
			if (!url){
				url = typeof Data.Models.idea.url == "string" && Data.Models.idea.url;
			}
			expect(url).toEqual('/api/v1/ideas/1');
	    });
	});
	
	describe("When creating a new idea", function(){
		it("should not change when attribute name is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.idea.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				description: "test",
				participant: "1",
			}
			Data.Models.idea.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute participant is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.idea.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				description: "test",
				name: "test",
			};
			Data.Models.idea.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute description is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.idea.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				participant: "1",
				name: "test",
			};
			Data.Models.idea.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should change when setting the name, participant and description attributes", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.idea.bind("error", spy);
			
			// set with required fields
			data = {
				participant: "1",
				name: "test",
				description: "test"
			};
			Data.Models.idea.set(data); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.idea_data = {
				"id":123, 
				"name": "test",
				"participant": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
				"description": "test"		 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/ideas",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.idea_data)
				]
			);
			
			// set data and save to create the post request
			//Data.Models.idea.bind('change', callback);
			
			data = {
				participant: "1",
				name: "test",
				description: "test"
			};
			Data.Models.idea.set(data);
			
			Data.Models.idea.save({}, {success: callback});
			
			// fake server response
			this.server.respond(); 
			a = callback;
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(123);
		});
	});	
});