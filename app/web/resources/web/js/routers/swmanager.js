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
		'!/user/registration?:params': "registration",
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
		Data.Views.admin = new App.Views.AdminUsers({el: ".admin-content"});
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
        result.unshift(deparam(result[result.length-1]));
        return result.slice(0,-1);
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

