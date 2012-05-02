describe("Vote Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.vote = new App.Models.Vote();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.vote.url == "function" && Data.Models.vote.url();
			if (!url){
				url = typeof Data.Models.vote.url == "string" && Data.Models.vote.url;
			}
			expect(url).toEqual('/api/v1/votes/');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.vote = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.vote.id = 1;
	      	url = typeof Data.Models.vote.url == "function" && Data.Models.vote.url();
			if (!url){
				url = typeof Data.Models.vote.url == "string" && Data.Models.vote.url;
			}
			expect(url).toEqual('/api/v1/votes/1/');
	    });
	});
	
	describe("When creating a new vote", function(){
		it("should not change when attribute user is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.vote.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				type: "idea",
				type_id: "1",
			}
			Data.Models.vote.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute type is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.vote.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				user: "1",
				type_id: "1",
			};
			Data.Models.vote.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute type_id is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.vote.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				user: "1",
				type: "idea",
			};
			Data.Models.vote.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should change when setting the user, type and type_id attributes", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.vote.bind("error", spy);
			
			// set with required fields
			data = {
				user: "1",
				type: "idea",
				type_id: "1"
			};
			Data.Models.vote.set(data); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.vote_data = {
				"id":123, 
				"type": "idea",
				"user": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
				"type_id": "1"		 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/votes/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.vote_data)
				]
			);
			
			// set data and save to create the post request
			//Data.Models.idea.bind('change', callback);
			
			data = {
				user: "1",
				type: "idea",
				type_id: "1"
			};
			Data.Models.vote.set(data);
			
			Data.Models.vote.save({}, {success: callback});
			
			// fake server response
			this.server.respond(); 
			a = callback;
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(123);
		});
	});	
});