App.Views.Auth = Backbone.View.extend({
	className: "login",
	initialize: function (){
		_.bindAll(this, 'render', 'login', 'logout', 'loginSubmit');
		this.render();	
	},
	
	events: {
		"click .login-btn": "login",
		"click .logout-btn": "logout",
		"keypress input[name='username']": "loginSubmit",
		"keypress input[name='password']": "loginSubmit" 
	},
	
	render: function (){
		token = Get_Cookie('Token');
		if (token == undefined){
			$(this.el).html(JST.login());							
		}else{
			if (Data.Models.session == undefined) {
				Data.Models.session = new App.Models.Session({
					user: {
						id: Get_Cookie('userID'),
						username: Get_Cookie('username'),
					},
					key: token,
					id: 1,
				});
			}
			Data.Models.account = new App.Models.Account({id: Get_Cookie('userID')});
			Data.Models.account.fetch({
				success: function (model, response){
					
				},
				error: function (model, response){
					
				}
			});
			$(this.el).html(JST.logout({model: Data.Models.session}));
			$("#main-menu").append('<li class="nav-item admin"><a href="#!/admin">Admin</a></li>');
			
		}
	},
	
	loginSubmit: function (e){
		try{
			var code = (e.keyCode ? e.keyCode : e.which);
			if((code == 13)) {
				e.preventDefault(); 
				this.login();
				return;
			}
		}catch(e){
			this.login();	
		}		
	},
	
	login: function (){
		log("auth");
		var view = this;
		username = $("[name=username]", this.el).val();
		password = $("[name=password]", this.el).val();		
		Data.Models.session = new App.Models.Session();
		
		Data.Models.session.bind("error", function(model, error){
			log("error");
			/*
$('.login-btn', view.el).popover({
				placement: "bottom",
				trigger: "manual",
				title: "Error",
				content: error,
			});
			$('.login-btn', view.el).popover('show');
			$("[name=username]", this.el).focus($('.login-btn', view.el).popover('hide'));
			$("[name=password]", this.el).focus($('.login-btn', view.el).popover('hide'));
*/
		});
		
		Data.Models.session.save({
				username: username,
				password: password,
			},{
				success: function (model, response){
					Set_Cookie('Token', response.key, 1, '/', host);
					Set_Cookie('username', response.user.username, 1, '/', host);
					Set_Cookie('userID', response.user.id, 1, '/', host);
					Data.Models.session.unset("password", {silent: true});
					view.render();
				},
				error: function (model, response){
					Data.Models.session.unset("password", {silent: true});
				}
			}
		);		
	},
	
	logout: function (){
		Delete_Cookie('Token', '/', host);
		Delete_Cookie('username', '/', host);
		Delete_Cookie('userID', '/', host);
		location = "/";
	}
})



/*
 * Facebook login 
 */
var FBLogin = function(){
	FB.login(function(response){
		if (response.authResponse) {
			log('Welcome!  Fetching your information.... ');
			FB.api('/me', function(response){
				console.log('Good to see you, ' + response.name + '.');
			});
		}
		else {
			log('User cancelled login or did not fully authorize.');
		}
	});
}