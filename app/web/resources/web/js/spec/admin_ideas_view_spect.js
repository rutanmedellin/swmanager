describe("Admin Ideas view", function (){
	beforeEach(function (){
		setFixtures('<div class="admin-content"></div>');
		$.fn.modal = function (options){};
		$.fn.typeahead = function (options){};
		
		this.view = new App.Views.AdminIdeas({el: ".admin-content"});		
	});
	
	afterEach(function (){
	
	});
	
	describe("Instantiation", function() {
    
		it("should create a div element with admin-content class", function() {
		  	expect(this.view.el.nodeName).toEqual("DIV");
		  	expect(this.view.el.className).toEqual("admin-content");
		});
    
  	});
	
	describe("Render the new idea form", function (){
		it("should render a div with class idea-form", function (){
			expect($(".idea-form", this.el).length).toEqual(1);
		});
		
		it("should render a input with participante as name and type text", function (){
			expect($("input[name=participant]", this.el).length).toEqual(1);
			expect($("input[name=participant]", this.el).attr("type")).toEqual("hidden");
		});
		
		it("should render a input with name as name and type text", function (){
			expect($("input[name=name]", this.el).length).toEqual(1);
			expect($("input[name=name]", this.el).attr("type")).toEqual("text");
		});
		
		it("should render a textarea with description as name", function (){
			expect($("textarea[name=description]", this.el).length).toEqual(1);
		});
		
		it("should render a button with Create as text and create class ", function (){
			expect($(".create", this.el).length).toEqual(1);
			expect($(".create", this.el).html()).toEqual("Create");
		});
		
	});
	
	describe("When method create is call", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.idea_data = {
				"id":123, 
				"name": "test",
				"participant": "1",
				"description": "test",
				"resource_uri": "/api/v1/ideas/123"
			};
		  
			this.server.respondWith(
				"POST", 
				"/api/v1/ideas/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.idea_data)
				]
			);
			
			this.idea = new App.Models.Idea();
			this.ideaStub = sinon.stub(window.App.Models, "Idea")
				.returns(this.idea);
				
			this.spy_save = sinon.spy(this.idea, "save");
			
			$("input[name=name]", this.el).val("test");
			$("input[name=participant]", this.el).val("1");
			$("textarea[name=description]", this.el).val("test");
			this.view.create();
			
		});
		
		afterEach(function (){
			this.server.restore();
			this.ideaStub.restore();
		});
		
		it("Should create an invitation model and save it", function(){
			expect(this.ideaStub.calledOnce).toEqual(true);
			expect(this.spy_save.calledOnce).toEqual(true);
			expect(this.spy_save.getCall(0).args[0].name).toEqual("test");
			expect(this.spy_save.getCall(0).args[0].participant).toEqual("1");
			expect(this.spy_save.getCall(0).args[0].description).toEqual("test");			
		});
	});
	
	describe("Render the ideas list", function (){
		beforeEach(function (){
			this.server = sinon.fakeServer.create();
			
			// session data
			this.ideas_collections = {
						"meta": {
							"limit": 20,
							"next": null,
							"offset": 0,
							"previous": null,
							"total_count": 4
						},
						"objects": [{
							"id": "4f84b22ade94e65caf000010",
							"participant": {
								id: "1",
								email: "juanpgaviria@gmail.com",
								username: "juanpgaviria@gmail.com",
								first_name: "juan",
								last_name: "gaviria",
								"resource_uri": "/api/v1/users/1/",	
							},
							"name": "test",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000010/",
						}, {
							"id": "4f84b22ade94e65caf000011",
							"participant": {
								id: "2",
								email: "castillobuiles@gmail.com",
								username: "castillobuiles@gmail.com",
								first_name: "sebastian",
								last_name: "castillo",
								"resource_uri": "/api/v1/users/2/",	
							},
							"name": "test",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000012",
							"participant": {
								id: "3",
								email: "manuelzs@gmail.com",
								username: "manuelzs@gmail.com",
								first_name: "manuel",
								last_name: "zapata",
								"resource_uri": "/api/v1/users/3/",	
							},
							"name": "test",
							"description": "Augue! Et nisi dis rhoncus ultrices cras tincidunt! Eu quis et proin, rhoncus vel tempor pulvinar risus integer, ridiculus integer, urna scelerisque, porttitor placerat cursus tincidunt dolor facilisis mus habitasse. Hac cras amet dapibus, mattis in, placerat tincidunt, non! A sagittis integer facilisis vut augue odio, est ac eu, eros a dictumst, egestas aliquam aliquam cras magnis! Sit dapibus in? Et phasellus aenean!",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}, {
							"id": "4f84b22ade94e65caf000013",
							"participant": {
								id: "4",
								email: "elizabeth.ramirez@rutanmedellin.org",
								username: "elizabeth.ramirez@rutanmedellin.org",
								first_name: "Eliza",
								last_name: "Ramirez",
								"resource_uri": "/api/v1/users/4/",	
							},
							"name": "test",
							"description": "test",
							"resource_uri": "/api/v1/ideas/4f84b22ade94e65caf000011/",
						}]
					};
		  
			this.server.respondWith(
				"GET", 
				"/api/v1/ideas/",
				[200, {"Content-Type": "application/json"},
				JSON.stringify(this.ideas_collections)
				]
			);
			
			this.ideas = new App.Collections.Ideas();
			this.ideas.fetch();
			this.server.respond();
						
			this.view.ideas = new App.Views.Ideas({el: ".participants-ideas", collection: this.ideas});				
		});
		
		afterEach(function (){
			this.server.restore();
		});
		
		it("Should render 4 ideas", function (){
			expect($(".idea", this.view.ideas.el).length).toEqual(this.ideas_collections.objects.length);
		});
		
		describe("Every idea item", function (){
			beforeEach(function (){
				this.idea = this.ideas.get(this.ideas_collections.objects[0].id);
				this.view.ideas.idea = new App.Views.Idea({model: this.idea});
				this.view.ideas.idea.render();
			});			
			
			it("should has a vote button", function (){
				expect($(".vote", this.view.ideas.idea.el).length).toEqual(1);
			});
			
			describe("When idea vote method is call", function (){
				beforeEach(function (){
					
					Data.Models.account = new App.Models.Account({
						id: "1",
						first_name: "juan",
						last_name: "gaviria",
						email: "juanpgaviria@gmail.com",
						role: "participants",						
					});
					Data.Models.account.id = 1;
					
					this.vote = new App.Models.Vote();
					this.voteStub = sinon.stub(window.App.Models, "Vote").returns(this.vote);
					
					this.spy_vote = sinon.spy(this.vote, "save");
					
					this.view.ideas.idea.vote();
				});
				
				afterEach(function (){
					Data.Models.account = undefined;
					this.voteStub.restore();
				});
				
				it("should create a vote model and save it", function (){
					expect(this.voteStub.calledOnce).toEqual(true);
					expect(this.spy_vote.getCall(0).args[0].user).toEqual(Data.Models.account.id);
					expect(this.spy_vote.getCall(0).args[0].type).toEqual("idea");
					expect(this.spy_vote.getCall(0).args[0].type_id).toEqual(this.idea.id);
					
				});
			});
		});
			
	});
});
