describe("AppRouter routes", function() {
  beforeEach(function() {
  	this.a = location;
    this.router = new App.Routers.StartupWeekendManager();
    this.routeSpy = sinon.spy();
    try {
      Backbone.history.start({silent:true, pushState:true});
    } catch(e) {}
    this.router.navigate("elsewhere");
  });
  
  afterEach(function (){
	this.router.navigate("/jasmine", true);
  });
  
  it("fires the index route with a blank hash", function() {
    this.router.bind("route:index", this.routeSpy);
    this.router.navigate("", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });  
});