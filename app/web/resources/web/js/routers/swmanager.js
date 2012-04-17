App.Routers.StartupWeekendManager = Backbone.Router.extend({
	
	initialize: function(){
		this.auth();
	},
	
	auth: function (){
		new App.Views.Auth({el: ".login"});		
	},
	
	routes: {
		'': "index",
	},
	
	/*
	 * index route
	 */
	index: function (){
		$("#wrapper").html(JST.index());
	},
	
});
