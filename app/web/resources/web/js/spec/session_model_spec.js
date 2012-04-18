describe("Session Model", function() {
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.session = new App.Models.Session();
	});

	afterEach(function() {
    	this.server.restore();
  	});
	
	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.session.url == "function" && Data.Models.session.url();
			if (!url){
				url = typeof Data.Models.session.url == "string" && Data.Models.session.url;
			}
			expect(url).toEqual('/api/v1/sessions');
	    });
	});
	
	describe("when id is set", function() {
	    it("should return the collection URL and id", function() {
			Data.Models.session.id = 1;
	      	url = typeof Data.Models.session.url == "function" && Data.Models.session.url();
			if (!url){
				url = typeof Data.Models.session.url == "string" && Data.Models.session.url;
			}
			expect(url).toEqual('/api/v1/sessions/1');
	    });
	});
	
	describe("When creating a new session", function(){
		it("should not change with attribute username is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.session.bind("error", spy);
			
			// set empty fields to trigger error
			Data.Models.session.set({password: "12345"});
			expect(spy.called).toBeTruthy();
			
			// set with required fields
			Data.Models.session.set({username: "admin", password: "123"}); 
			expect(spy.calledTwice).toEqual(false);		
		});
		
		it("should not change with attribute password is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.session.bind("error", spy);
			
			// set empty fields to trigger error
			Data.Models.session.set({username: "admin"});
			expect(spy.called).toBeTruthy();
			
			// set with required fields
			Data.Models.session.set({username: "admin", password: "123"}); 
			expect(spy.calledTwice).toEqual(false);		
		});
		
		it("should change when setting the username and password", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.session.bind("error", spy);
			
			// set with required fields
			Data.Models.session.set({username: "admin", password: "123"}); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.session_data = {
				"id":123, 
				"key": "123",
				"user": {
					"id": "1",
					"username": "admin",
					"first_name": "juan",
					"last_name": "gaviria",
					"email": "juanpgaviria@gmail.com",
				}				 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/sessions",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.session_data)
				]
			);
			
			// set data and save to create the post request
			Data.Models.session.set({username: "admin", password: "123"});
			
			Data.Models.session.bind('change', callback);
			Data.Models.session.save();
			
			// fake server response
			this.server.respond(); 
			
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(123);
		});
	});	
});
