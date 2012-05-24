describe("Projects collection", function (){
	beforeEach(function() {
		this.eventModelStub = sinon.stub(window.App.Models, "Event");
		this.event = new Backbone.Model({
	  		'id': 1,
			'resource_uri': "/api/v1/events/1/",
			'name': "Startup Weekend Medellín",
			'email': "medellin@startupweekend.org",
			'twitter': "SWCol",
			'description': "Hola mundo",
			'url': 'http://medellin.startupweekend.org',
			'start_date': 23345342334,
			'end_date': 23345342334,
			'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",			
		});
		
		this.eventModelStub.returns(this.event);
		this.events = new App.Collections.Events();
		this.events.model = App.Models.Event; // reset model relationship to use stub
		this.events.add({
		  	'id': 2,
			'resource_uri': "/api/v1/events/2/",
			'name': "Startup Weekend Medellín",
			'email': "medellin@startupweekend.org",
			'twitter': "SWCol",
			'description': "Hola mundo",
			'url': 'http://medellin.startupweekend.org',
			'start_date': 23345342334,
			'end_date': 23345342334,
			'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
		});
	});
	
	afterEach(function() {
		this.eventModelStub.restore();
	});
	
	it("should add a model", function() {
		expect(this.events.length).toEqual(1);
	});
	
	describe("When fetching projects", function (){
		beforeEach(function() {
			//start fake server
			this.server = sinon.fakeServer.create();
			
			// set fixtures
			
			this.fixtures = {
				"meta": {
					"limit": 20,
					 "next": null, 
					 "offset": 0, 
					 "previous": null, 
					 "total_count": 2
				}, 
				"objects": [
						{
						  	'id': 1,
							'resource_uri': "/api/v1/events/1/",
							'name': "Startup Weekend Medellín",
							'email': "medellin@startupweekend.org",
							'twitter': "SWCol",
							'description': "Hola mundo",
							'url': 'http://medellin.startupweekend.org',
							'start_date': 23345342334,
							'end_date': 23345342334,
							'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
						},
						{
					  		'id': 2,
							'resource_uri': "/api/v1/events/2/",
							'name': "Startup Weekend Medellín",
							'email': "medellin@startupweekend.org",
							'twitter': "SWCol",
							'description': "Hola mundo",
							'url': 'http://medellin.startupweekend.org',
							'start_date': 23345342334,
							'end_date': 23345342334,
							'cover': "http://medellin.startupweekend.org/files/2012/05/cabezote-SWMed1.jpg",
						}
				]
			};
			
			// fake response
			this.server.respondWith(
			    "GET",
			    "/api/v1/events/",
			    [
			      200,
			      {"Content-Type": "application/json"},
			      JSON.stringify(this.fixtures)
			    ]
			);
				
			// projects collection instance
			this.events = new App.Collections.Events();		
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("should make the correct request", function() {
			this.events.fetch();
			expect(this.server.requests.length)
				.toEqual(1);
			expect(this.server.requests[0].method)
				.toEqual("GET");
			expect(this.server.requests[0].url)
				.toEqual("/api/v1/events/");
		});
		
		it("should parse events from the response", function (){
			this.events.fetch();
			this.server.respond();
			Data.Collections.events = this.events;
			expect(this.events.length)
				.toEqual(this.fixtures.objects.length);
			expect(this.events.get("1").get('url')).
				toEqual(this.fixtures.objects[0].url);
		});
		
	});
	
});
