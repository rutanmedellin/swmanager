var a;
App.Routers.StartupWeekendManager = Backbone.Router.extend({
	
	initialize: function(){
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
		'!/admin/user/:id': "adminAccount",
		'!/user/registration?:params': "registration",
		'!/admin/user/:id/edit': "adminEditProfile",
		'!/admin/ideas': "adminIdeas",
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
		$("#wrapper").html(JST.index());
		this.navActive("home");
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

