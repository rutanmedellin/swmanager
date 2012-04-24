/*
 * global variables 
 */

var host = (location.host[0] == "." || location.host.search("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)") == 0) ? location.host : '.' + location.host;


/*
 * Backbone.js app init
 */
 
var App = {
	Views: {},
	Routers: {},
	Models: {},
	Collections: {},
	init: function(){
		log('init');
		username = Get_Cookie('username');
		Data.Routers.router = new App.Routers.StartupWeekendManager();		
		Backbone.history.start();
	},
	
};

var Data = {
	Views: {},
	Routers: {},
	Models: {},
	Collections: {},	
}


/*
 * Backbone custom sync
 */

 var SWMSync = function (method, model, options) {
	var token = Get_Cookie('Token');
	if(token){
		options.dataType = "json";
		options.beforeSend = function (xhr) { 
				xhr.setRequestHeader("X-Geochat-Auth-Token", token); 
		};			
	}else{
		if (Data.Models.session instanceof App.Models.Session && method.toLocaleLowerCase() == "create"){
			username = model.get("username");
			password = model.get("password");
			basicEncode = Base64.encode(username + ':' + password);
			options.beforeSend = function(xhr){
				xhr.setRequestHeader("Authorization", "Basic " + basicEncode);
			}; 	
		}		
	}
	Syncoptions = options;
	return Backbone.sync(method, model, options);
};

/*
 * Custom base backbone model
 */

App.Models.BaseModel = Backbone.Model.extend({
	sync : SWMSync,
});


/*
 * Custom base backbone collection
 */

App.Collections.BaseCollection = Backbone.Collection.extend({
	sync : SWMSync,
});


/*
 * Gravatar calculator
 */
var Gravatar = function (email){
	email = email;
	email = email.toLowerCase();
	md5 = MD5(email);
	return "http://www.gravatar.com/avatar/" + md5;
};
 