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
 	if (model.spin == undefined || model.spin == true) {
		$("#loading").modal({
			backdrop: "static"
		});
		$(".modal-backdrop").css("width", "100%");
		$(".modal-backdrop").css("height", "100%");
		$(".modal-backdrop").spin({
			lines: 17, // The number of lines to draw
			length: 30, // The length of each line
			width: 5, // The line thickness
			radius: 2, // The radius of the inner circle
			rotate: 33, // The rotation offset
			color: '#FFF', // #rgb or #rrggbb
			speed: 1.3, // Rounds per second
			trail: 42, // Afterglow percentage
			shadow: true, // Whether to render a shadow
			hwaccel: true, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: 'auto', // Top position relative to parent in px
			left: 'auto' // Left position relative to parent in px
		});
		var spinStop = function (mm){
			setTimeout(function (){
				$(".modal-backdrop").spin(false);
				$("#loading").modal("hide");
			}, mm);
		}
		spinStop(10000);
		options.complete = function (){							
			spinStop(1300);
		};
	}
	var token = Get_Cookie('Token');
	var user = Get_Cookie('username');
	if(token && user){
		options.dataType = "json";
		options.beforeSend = function (xhr) { 
				xhr.setRequestHeader("Authorization", "ApiKey " + user + ":" + token); 
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
	/*
if (model.data != undefined){
		options.data.limit = 0;
	}else{
		options.data = {limit: 0};
	}
*/
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
 
/*
 * replace bootstrap modal for mobile devices for alert
 */

$(document).ready(function (){
	/*
try{
		userAgent = (userAgent == undefined ? "": "baseline");	
	}catch(e){
		userAgent = "";
	}
*/
	try{
		if( userAgent == ""){
		mobileModal = function (options){
			var selector = this.selector;
			if (selector.search("loading") > 0) {
				$.fn.modal = $.fn.orgmodal;
				$(this).modal(options);
				$.fn.orgmodal = $.fn.modal;
				$.fn.modal = mobileModal;		
			}
			else {
				if (selector.search("success") > 0) {
					alert("Request Success ;)");
				}
				else 
					if (selector.search("error") > 0) {
						alert("Request Fail, try again later :(");
					}
			}
		}
		$.fn.orgmodal = $.fn.modal;
		$.fn.modal = mobileModal;
	}	
	}catch(e){}
	
});
 