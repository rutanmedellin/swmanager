describe("Auth AppRouter", function() {

  beforeEach(function() {
    
    this.authViewStub = sinon.stub(window.App.Views, "Auth")
      .returns(new Backbone.View());
  });
    
  afterEach(function() {
    window.App.Views.Auth.restore();
  });
  describe("Auth handler", function() {
  	it("must create a App.View.Auth view", function (){
 		this.router = new App.Routers.StartupWeekendManager();
		expect(this.authViewStub.calledOnce);
  	});
  });
});
