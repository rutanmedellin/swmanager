describe("Account Model", function (){
	
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		Data.Models.account = new App.Models.Account();
	});

	afterEach(function() {
    	this.server.restore();
  	});

	describe("when no id is set", function() {
	    it("should return the collection URL", function() {
	      	url = typeof Data.Models.account.url == "function" && Data.Models.account.url();
			if (!url){
				url = typeof Data.Models.account.url == "string" && Data.Models.account.url;
			}
			expect(url).toEqual('/api/v1/users');
	    });
	});
	
	describe("when id is set", function() {
		afterEach(function() {
	    	Data.Models.account = undefined;
	  	});
		
	    it("should return the collection URL and id", function() {
			Data.Models.account.id = 1;
	      	url = typeof Data.Models.account.url == "function" && Data.Models.account.url();
			if (!url){
				url = typeof Data.Models.account.url == "string" && Data.Models.account.url;
			}
			expect(url).toEqual('/api/v1/users/1');
	    });
	});
	
	describe("When fectching the account info", function (){
		
		beforeEach(function(){
			this.account = new App.Models.Account();
			this.account.id = 1;
			this.callback = sinon.spy();
			
			//this.server = sinon.fakeServer.create();
			
			// set server response
			this.user_data = {
				"id":1, 
				"username":"admin", 
				"role": "participant", 
				"first_name": "juan", 
				"last_name": "gaviria", 
				"email": "juanpgaviria@gmail.com", 
				"ideas": "/api/v1/ideas/?user=1", 
				"projects": "/api/v1/projects/?user=1"
			};
			
			this.server.respondWith(
				"GET", 
				"/api/v1/users/1",
				[
					200, 
					{"Content-Type": "application/json"},
					JSON.stringify(this.user_data)
				]
			);
		});
	
		afterEach(function() {
	    	this.server.restore();
	  	});

		
		it("should has the attribute id, username, role, first_name, last_name, email, ideas, projects", function (){
			this.account.fetch();
			log(this.account.url());
			this.server.respond();
			log(this.account.get("id"));
			
			expect(this.account.get("id")).toEqual(1);
			expect(this.account.get("username")).toEqual("admin");
			expect(this.account.get("role")).toEqual("participant");
			expect(this.account.get("first_name")).toEqual("juan");
			expect(this.account.get("last_name")).toEqual("gaviria");
			expect(this.account.get("email")).toEqual("juanpgaviria@gmail.com");
			expect(this.account.get("ideas")).toEqual("/api/v1/ideas/?user=1");
			expect(this.account.get("projects")).toEqual("/api/v1/projects/?user=1");
		});		
	});
	
});







