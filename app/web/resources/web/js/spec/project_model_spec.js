describe("Project Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.project = new App.Models.Project();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.project.url == "function" && Data.Models.project.url();
			if (!url){
				url = typeof Data.Models.project.url == "string" && Data.Models.project.url;
			}
			expect(url).toEqual('/api/v1/projects/');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.project = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.project.id = 1;
	      	url = typeof Data.Models.project.url == "function" && Data.Models.project.url();
			if (!url){
				url = typeof Data.Models.project.url == "string" && Data.Models.project.url;
			}
			expect(url).toEqual('/api/v1/projects/1/');
	    });
	});
	
	describe("When creating a new project", function(){
		it("should not change when attribute name is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.project.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				description: "test",
				owner: "1",
			}
			Data.Models.project.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should not change when attribute owner is empty", function(){
			
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.project.bind("error", spy);
			
			// set empty fields to trigger error
			data = {
				description: "test",
				name: "test",
			};
			Data.Models.project.set(data);
			expect(spy.called).toBeTruthy();
		});
		
		it("should change when setting the name and owner attributes", function (){
			// Create empty spy
			var spy = sinon.spy();
			
			// bind spy when trriger a validation error  
			Data.Models.project.bind("error", spy);
			
			// set with required fields
			data = {
				owner: "1",
				name: "test",
				description: "test"
			};
			Data.Models.project.set(data); 
			expect(spy.called).toEqual(false);		
		});
		
		
		it("should after save expose id attribute", function (){
			
			var callback = sinon.spy();
			
			// session data
			this.project_data = {
				"id":123, 
				"name": "test",
				"owner": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
				"description": "test",
				"resource_uri": "/api/v1/projects/123/"		 
			};
			
			// set server response
			this.server.respondWith(
				"POST", 
				"/api/v1/projects/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.project_data)
				]
			);
			
			// set data and save to create the post request
			//Data.Models.idea.bind('change', callback);
			
			data = {
				owner: "1",
				name: "test",
				description: "test"
			};
			Data.Models.project.set(data);
			
			Data.Models.project.save({}, {success: callback});
			
			// fake server response
			this.server.respond(); 
			a = callback;
			expect(callback.called).toBeTruthy();
			expect(callback.getCall(0).args[0].attributes.id)
				.toEqual(123);
		});
	});	
});