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
  
  it("fires the admin route with a #!/admin hash", function (){
  	this.router.bind("route:admin", this.routeSpy);
    this.router.navigate("/#!/admin", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/participants hash", function (){
  	this.router.bind("route:adminParticipants", this.routeSpy);
    this.router.navigate("/#!/admin/participants", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/admin-users hash", function (){
  	this.router.bind("route:adminUsers", this.routeSpy);
    this.router.navigate("/#!/admin/admin-users", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/ideas hash", function (){
  	this.router.bind("route:adminIdeas", this.routeSpy);
    this.router.navigate("/#!/admin/ideas", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/projects hash", function (){
  	this.router.bind("route:adminProjects", this.routeSpy);
    this.router.navigate("/#!/admin/projects", true); 
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/account hash", function (){
  	this.router.bind("route:adminAccount", this.routeSpy);
    this.router.navigate("/#!/admin/account", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/user/:id hash", function (){
  	this.router.bind("route:adminAccount", this.routeSpy);
    this.router.navigate("/#!/admin/user/1", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/user/:id/edit hash", function (){
  	this.router.bind("route:adminEditProfile", this.routeSpy);
    this.router.navigate("/#!/admin/user/1/edit", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/idea/:id hash", function (){
  	this.router.bind("route:adminIdea", this.routeSpy);
    this.router.navigate("/#!/admin/idea/1", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  it("fires the admin route with a #!/admin/idea/:id/edit hash", function (){
  	this.router.bind("route:adminIdeaEdit", this.routeSpy);
    this.router.navigate("/#!/admin/idea/1/edit", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });

  
  it("fires the registration route with a #!/user/registration hash", function (){
  	this.router.bind("route:registration", this.routeSpy);
    this.router.navigate("/#!/user/registration?email=juanpgaviria@gmail.com&code=1234", true);
    expect(this.routeSpy.calledOnce).toBeTruthy();
  });
  
  
});