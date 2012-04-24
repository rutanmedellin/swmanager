describe("User Registration view", function (){
	beforeEach(function (){
		setFixtures('<div id="wrapper"></div>');
		this.view = new App.Views.UserRegistration({el: "#wrapper", code: "123", email: "juanpgaviria@gmail.com"});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.id).toEqual("wrapper");
		});
    
  	});
	
	describe("Render the registration form", function (){
		it("should render a div with class registrtion-form", function (){
			expect($(".registrtion-form", this.el).length).toEqual(1);
		});
		
		it("should render a input with email as name and type text", function (){
			expect($("input[name=email]", this.el).length).toEqual(1);
			expect($("input[name=email]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a input with password as name and type password", function (){
			expect($("input[name=password]", this.el).length).toEqual(1);
			expect($("input[name=password]", this.el).attr("type")).toEqual("password");
		});
		
		it("should render a input with repassword as name and type password", function (){
			expect($("input[name=repassword]", this.el).length).toEqual(1);
			expect($("input[name=repassword]", this.el).attr("type")).toEqual("password");
		});
		
		
		it("should render a input with code as name and type hidden and value admin", function (){
			expect($("input[name=code]", this.el).length).toEqual(1);
			expect($("input[name=code]", this.el).attr("type")).toEqual("hidden");
			expect($("input[name=code]", this.el).val()).toEqual("123");
		});
		
		it("should render a button with Sign Up as text and signup class ", function (){
			expect($(".signup", this.el).length).toEqual(1);
			expect($(".signup", this.el).html()).toEqual("Sign up");
		});
		
	});
	
	describe("When method signup is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.registration_data = {
				"id":1, 
				"username":"juanpgaviria@gmail.com", 
				"role": "admin", 
				"first_name": "", 
				"last_name": "", 
				"email": "juanpgaviria@gmail.com", 
				"ideas": "/api/v1/ideas/?user=1", 
				"projects": "/api/v1/projects/?user=1"
			};
		  
			this.server.respondWith(
				"POST", 
				"/api/v1/users",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.registration_data)
				]
			);
			
			this.user = new App.Models.User();
			this.userModelStub = sinon.stub(window.App.Models, "User")
				.returns(this.user);
				
			this.spy_save = sinon.spy(this.user, "save");
			
			this.view.render();
			
			$("input[name=email]", this.el).val("juanpgaviria@gmail.com");
			$("input[name=code]", this.el).val("1234");
			$("input[name=password]", this.el).val("abc");
			$("input[name=repassword]", this.el).val("abc");
			
			this.view.signup();			
		});
		
		afterEach(function (){
			this.server.restore();
			this.userModelStub.restore();
		});
		
		it("Should create an user model and save it", function(){
			expect(this.userModelStub.calledOnce).toEqual(true);
			expect(this.spy_save.calledOnce).toEqual(true);
			expect(this.spy_save.getCall(0).args[0].email).toEqual("juanpgaviria@gmail.com");
			expect(this.spy_save.getCall(0).args[0].code).toEqual("1234");			
		});
	});
});
