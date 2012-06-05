var args;
describe("App.Views.Auth", function() {
  
  beforeEach(function() {
	setFixtures('<div class="login"></div>');
	
	this.server = sinon.fakeServer.create();
	
	this.user_data = {
		id: "1",
		first_name: "juan",
		last_name: "gaviria",
		email: "juanpgaviria@gmail.com",
		role: "admins",
		votes: [],
	};
	
	this.server.respondWith(
		"GET", 
		"/api/v1/users/1/",
		[200, {"Content-Type": "application/json"},
		JSON.stringify(this.user_data)
		]
	);
	this.view = new App.Views.Auth({el: ".login"});
  });
  
  afterEach(function (){
  	this.server.restore();
  });
  
  describe("Instantiation", function() {
    
    it("should create a div element with login class", function() {
      expect(this.view.el.nodeName).toEqual("DIV");
	  expect(this.view.el.className).toEqual("login");
    });
    
  });
  
  describe("Rendering the login form", function (){
  	beforeEach(function() {
		Delete_Cookie('Token', '/', host);
	  	Delete_Cookie('username', '/', host);
		Delete_Cookie('userID', '/', host);	  	
      	this.view.render();
    });
    
    afterEach(function() {
    });
	
	it("should create form with username, password and button", function() {
	  expect($("[name=username]", this.view.el).val()).toEqual("");
	  expect($("[name=password]", this.view.el).val()).toEqual("");
	  expect($(".login-btn", this.view.el).length).toEqual(2);
	});
	
  });
  
  describe("Login the user", function (){
  	beforeEach(function() {
	  // fake server response
	  this.server = sinon.fakeServer.create();
	  
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
	  
	  this.server.respondWith(
		"POST", 
		"/api/v1/sessions",
		[200, {"Content-Type": "application/json"},
		JSON.stringify(this.session_data)
		]
	  );	
		
	  // delete cookies
	  Delete_Cookie('Token', '/', host);
	  Delete_Cookie('username', '/', host);
	  
	  // session model stub	
      this.sessionModel = new App.Models.Session();	  
      this.sessionModelStub = sinon.stub(window.App.Models, "Session")
        .returns(this.sessionModel);
		
	  // spy the save method of the session model		  	  
	  this.spy_save = sinon.spy(this.sessionModel, "save");
	  	  
	  // render de auth view
      this.view.render();
	  
	  // set username and password
	  $("[name=username]", this.view.el).val("admin");
	  $("[name=password]", this.view.el).val("123");
	  
	  // call the login model method.
	  this.view.login();
    });
    
    afterEach(function() {
      window.App.Models.Session.restore();	  
	  this.server.restore();
    });
	
	it("should create a App.Models.Session object on login", function (){
		expect(this.sessionModelStub.calledOnce).toEqual(true);
	  	expect(this.spy_save.calledOnce).toEqual(true);
		expect(this.spy_save.getCall(0).args[0].username).toEqual("admin");
		expect(this.spy_save.getCall(0).args[0].password).toEqual("123");
	});
  });
   
  describe("Render a loged user", function (){
  	beforeEach(function() {
		Set_Cookie('Token', "12345", 1, '/', host);
		Set_Cookie('username', "admin", 1, '/', host);
		Set_Cookie('userID', "1", 1, '/', host);

		Data.Models.session = undefined;

		// account model stub
		this.accountModel = new App.Models.Account();	  
		this.accountModelStub = sinon.stub(window.App.Models, "Account")
			.returns(this.accountModel);
		
		// spy the fetch account
		this.spy_fetch = sinon.spy(this.accountModel, "fetch");

		// render view
		this.ajax = $.ajax;
		$.ajax = function (options){		
				return options.success({
				id: "1",
				username: "juanpgaviria@gmail.com",
				first_name: "juan",
				last_name: "gaviria",
				email: "juanpgaviria@gmail.com",
				role: "admins",
				votes: [],
			});
		};		
		this.view.render();
		$.ajax = this.ajax;
    });
    
    afterEach(function() {
		Delete_Cookie('Token', '/', host);
	  	Delete_Cookie('username', '/', host);
		Delete_Cookie('userID', '/', host);
		this.accountModelStub.restore();
    });
	
	it("must render string with username and logout button", function (){
		expect(Get_Cookie('Token')).toEqual("12345");
		//expect($(this.view.el).html())
		//	.toEqual('<p class="navbar-text pull-right">Logged in as <a href="#">admin</a> | <a class="logout-btn">logout</a></p>');
	});
  });
  
});
