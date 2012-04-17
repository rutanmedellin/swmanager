var args;
describe("App.Views.Auth", function() {
  
  beforeEach(function() {
	setFixtures('<div class="login"></div>');
	this.view = new App.Views.Auth({el: ".login"});
  });
  
  describe("Instantiation", function() {
    
    it("should create a div element with login class", function() {
      expect(this.view.el.nodeName).toEqual("DIV");
	  expect(this.view.el.className).toEqual("login");
    });
    
  });
  
  describe("Rendering the login form", function (){
  	beforeEach(function() {
      this.view.render();
    });
    
    afterEach(function() {
    });
	
	it("should create form with username, password and button", function() {
	  expect($("[name=username]", this.view.el).val()).toEqual("");
	  expect($("[name=password]", this.view.el).val()).toEqual("");
	  expect($(".login-btn", this.view.el).length).toEqual(1);
	});
	
  });
  
  describe("Login the user", function (){
  	beforeEach(function() {
	  // fake server response
	  this.server = sinon.fakeServer.create();
	  this.server.respondWith(
		"POST", 
		"/api/v1/sessions",
		[200, {"Content-Type": "application/json"},
		'{"id":123, "username":"admin"}']
	  );	
		
	  // delete cookies
	  Delete_Cookie('Token', '/', host);
	  Delete_Cookie('username', '/', host);
	  	
      this.sessionModel = new App.Models.Session();	  
      this.sessionModelStub = sinon.stub(window.App.Models, "Session")
        .returns(this.sessionModel);	  
	  this.spy = sinon.spy(this.sessionModel, "save");
      this.view.render();
	  $("[name=username]", this.view.el).val("admin");
	  $("[name=password]", this.view.el).val("123");
	  $(".login-btn", this.view.el).click();
    });
    
    afterEach(function() {
      window.App.Models.Session.restore();
	  this.server.restore();
    });
	
	it("should create a App.Models.Session object on login", function (){
		expect(this.sessionModelStub.calledOnce).toEqual(true);
	  	expect(this.spy.calledOnce).toEqual(true);
		expect(this.spy.getCall(0).args[0].username).toEqual("admin");
		expect(this.spy.getCall(0).args[0].password).toEqual("123");
	});
  });
   
  describe("Render a loged user", function (){
  	beforeEach(function() {
		Set_Cookie('Token', "12345", 1, '/', host);
		Set_Cookie('username', "admin", 1, '/', host);
		this.view.render();
    });
    
    afterEach(function() {
		Delete_Cookie('Token', '/', host);
	  	Delete_Cookie('username', '/', host);
    });
	
	it("must render string with username and logout button", function (){
		expect(Get_Cookie('Token')).toEqual("12345");
		//expect($(this.view.el).html())
		//	.toEqual('<p class="navbar-text pull-right">Logged in as <a href="#">admin</a> | <a class="logout-btn">logout</a></p>');
	});
	
  });
  
});