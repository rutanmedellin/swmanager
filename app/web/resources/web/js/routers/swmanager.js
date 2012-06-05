var a;
App.Routers.StartupWeekendManager = Backbone.Router.extend({
	
	initialize: function(options){
		this.auth();
	},
	
	auth: function (){
		new App.Views.Auth({el: ".login"});		
	},
	
	routes: {
		'': "index",
		'!/admin': "admin", 
		'!/admin/admin-users': "adminUsers",
		'!/admin/participants': "adminParticipants",
		'!/admin/account': "adminAccount",
		'!/admin/users/:id': "adminAccount",
		'!/user/registration?:params': "registration",
		'!/admin/users/:id/edit': "adminEditProfile",
		'!/admin/ideas': "adminIdeas",
		'!/admin/ideas/:id': "adminIdea",
		'!/admin/ideas/:id/edit': "adminIdeaEdit",
		'!/admin/projects': "adminProjects",
		'!/admin/projects/:id': "adminProject",
		'!/admin/event': "adminEvent",
		'!/admin/projects/:id/edit': "adminProjectEdit",
		'!/public/projects': "publicProjects",
		'!/public/projects/:id': "publicProject",
		'!/public/participants': "publicParticipants",
		'!/public/participants/:id': "publicParticipant",
	},
	
	/*
	 * Set nav active item, this has to be call when #main-menu item click
	 * the item must have a class name exactly the same as the section param
	 */
	
	navActive: function (section){
		_.each($("#main-menu li"), function (e){$(e).removeClass("active")});
		if (section != undefined){
			$("." + section).addClass("active");	
		}
		
	},
	
	/*
	 * index route
	 */
	index: function (){
		this.navActive("home");
		
		events_collection = new App.Collections.Events();
		events_collection.fetch({
			success: function(collection, response){
				/*
				 * There only one event :P, but we need the ID
				 */
				event_model = (collection.length < 1 ? new App.Models.Event() : collection.pop());
				Data.Views.publicView = new App.Views.Home({ el: "#wrapper", model: event_model});
			},
			error: function(collection, response){
			
			}
		});
	},
	
	/*
	 * admin route
	 */
	
	admin: function (section){
		Data.Views.admin = new App.Views.Admin({el: "#wrapper", model: Data.Models.account, section: section});
		this.navActive("admin");	
	},
	
	adminUsers: function (){
		this.admin("admin-users");
		Data.Views.admin = new App.Views.AdminUsers({el: ".admin-content", role: "admins"});
	},
	
	adminParticipants: function (){
		this.admin("participants")
		Data.Views.admin = new App.Views.AdminUsers({el: ".admin-content", role: "participants"});
	},
	
	adminAccount: function (id){
		this.admin("account");
		if (id != undefined){
			user = new App.Models.User();
			user.id = id;
			log(id);
			user.fetch({
				success: function (model, response){
					Data.Views.admin = new App.Views.UserProfileView({el: ".admin-content", model: model});
				},
				error: function (model, response){
						
				}
			});
		}else{
			Data.Views.admin = new App.Views.UserProfileView({el: ".admin-content", model: Data.Models.account});
		}
				
	},
	
	adminEditProfile: function (id){
		this.admin();
		a = id;		
		if ((id != undefined && id == Data.Models.account.id) || Data.Models.account.get("role") == "admins"){
			user = new App.Models.User();
			user.id = id;
			user.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.UserProfileEditView({
						el: ".admin-content",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	adminIdeas: function (){
		this.admin("ideas");
		Data.Views.admin = new App.Views.AdminIdeas({el: ".admin-content"});
	},
	
	adminIdea: function (id){
		this.admin("ideas");
		if (id != undefined){
			idea = new App.Models.Idea();
			idea.id = id;
			idea.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.AdminIdea({
						el: ".admin-content",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	adminIdeaEdit: function (id){
		this.admin("ideas");
		if (id != undefined){
			idea = new App.Models.Idea();
			idea.id = id;
			idea.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.AdminIdeaEdit({
						el: ".admin-content",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	adminProjects: function (){
		this.admin("projects");
		Data.Views.admin = new App.Views.AdminProjects({el: ".admin-content"});
	},
	
	adminProject: function (id){
		this.admin("projects");
		if (id != undefined){
			project = new App.Models.Project();
			project.id = id;
			project.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.AdminProject({
						el: ".admin-content",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	adminProjectEdit: function (id){
		this.admin("projects");
		if (id != undefined){
			project = new App.Models.Project();
			project.id = id;
			project.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.AdminProjectEdit({
						el: ".admin-content",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	adminEvent: function () {
		this.admin("event");
		if (Data.Models.account.get("role") == "admins"){
			events = new App.Collections.Events();
			events.fetch({
				success: function(collection, response){
					/*
					 * There only one event :P, but we need the ID
					 */
					event_model = (collection.length < 1 ? new App.Models.Event() : collection.pop()); 
					Data.Views.admin = new App.Views.AdminEvent({
						el: ".admin-content",
						model: event_model
					});
				},
				error: function(collection, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	/*
	 * Public routes
	 */
	
	publicParticipants: function (){
		this.navActive("participants");
		Data.Views.publicView = new App.Views.PublicParticipants({el: "#wrapper"});
	},

	publicParticipant: function (id){
		this.navActive("participants");
		$("#wrapper").html(JST.public_list());
		if (id != undefined){
			participant = new App.Models.User();
			participant.id = id;
			participant.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.UserProfileView({
						el: "#list",
						model: model
					});
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},

	publicProjects: function (){
		this.navActive("projects");
		Data.Views.publicView = new App.Views.PublicProjects({el: "#wrapper"});
	},
	
	publicProject: function (id){
		this.navActive("projects");
		$("#wrapper").html(JST.public_list());
		if (id != undefined){
			project = new App.Models.Project();
			project.id = id;
			project.fetch({
				success: function(model, response){
					Data.Views.admin = new App.Views.AdminProject({
						el: "#list",
						model: model
					});
					FB.XFBML.parse();
				},
				error: function(model, response){
				
				}
			});
		}else{
			$(".admin-content").html(JST.permission_denied());
		}
	},
	
	
	/*
	 * Registration route
	 */
	
	registration: function (params){
		var code = (params.code != undefined ? params.code : "");
		var email = (params.email != undefined ? params.email : "");
		new App.Views.UserRegistration({el: "#wrapper", code: code, email: email});
		
	},
	
	_extractParameters: function(route, fragment) {
        var result = route.exec(fragment).slice(1);
		result = _.map(result, function (param){
			if (param.match(/^([A-Za-z0-9]+)=([A-Za-z0-9]+)/)){
				return deparam(param);
			}else{
				return param;
			}
		});
		return result;
    }
	
});

/*
 * To be able to get the ?key=value after #..
 * see http://stackoverflow.com/questions/7445353/key-value-pair-params-handling-in-backbone-js-router and
 * http://jsfiddle.net/avrelian/h5wL2/ 
 * 
 * in th jsfiddle open firebug to see the result :P
 */

var deparam = function(paramString){
    var result = {};
	log(paramString);
    if( ! paramString){
        return result;
    }
    $.each(paramString.split('&'), function(index, value){
        if(value){
            var param = value.split('=');
            result[param[0]] = param[1];
        }
    });
    return result;
};

