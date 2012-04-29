describe("Invitation Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.invitation = new App.Models.Invitation();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.invitation.url == "function" && Data.Models.invitation.url();
			if (!url){
				url = typeof Data.Models.invitation.url == "string" && Data.Models.invitation.url;
			}
			expect(url).toEqual('/api/v1/invitations');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.invitation = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.invitation.id = 1;
	      	url = typeof Data.Models.invitation.url == "function" && Data.Models.invitation.url();
			if (!url){
				url = typeof Data.Models.invitation.url == "string" && Data.Models.invitation.url;
			}
			expect(url).toEqual('/api/v1/invitations/1');
	    });
	});
	
	describe("When creating a new invitation", function(){
		it("should not change when attribute email is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.invitation.bind("error", spy);
			
			// set empty fields to trigger error
			Data.Models.invitation.set({role: "admin"});
			expect(spy.called).toBeTruthy();
			
			// set with required fields
			Data.Models.invitation.set({role: "admin", email: "admin@example.com"}); 
			expect(spy.calledTwice).toEqual(false);		
		});
		
		it("should not change when attribute role is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.invitation.bind("error", spy);
			
			// set empty fields to trigger error
			Data.Models.invitation.set({email: "admin@example.com"});
			expect(spy.called).toBeTruthy();
			
			// set with required fields
			Data.Models.invitation.set({email: "admin@example.com", role: "admin"}); 
			expect(spy.calledTwice).toEqual(false);		
		});
		
		it("should change when setting the email and role attributes", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.invitation.bind("error", spy);
			
			// set with required fields
			Data.Models.session.set({email: "admin@example.com", role: "admin"}); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.invitation_data = {
				"id":123, 
				"email": "juanpgaviria@gmail.com",
				"role": "admin"		 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/invitations",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.invitation_data)
				]
			);
			
			// set data and save to create the post request
			Data.Models.invitation.set({email: "juanpgaviria@gmail.com", role: "admin"});
			
			Data.Models.invitation.bind('change', callback);
			Data.Models.invitation.save();
			
			// fake server response
			this.server.respond(); 
			
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(123);
		});
	});	
});