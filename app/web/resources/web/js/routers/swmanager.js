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
	}
	
});
