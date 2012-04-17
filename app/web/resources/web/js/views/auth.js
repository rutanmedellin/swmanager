App.Views.Auth = Backbone.View.extend({
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
		token = Get_Cookie('swmToken');
		if (token == undefined){
			$(this.el).html(JST.login());							
		}else{
			$(this.el).html(JST.logout());
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
		username = $("[name=username]", this.el).val();
		password = $("[name=password]", this.el).val();		
		Data.Models.session = new App.Models.Session();
		Data.Models.session.save({
			username: username,
			password: password,
		},{
			success: function (response, model){
				Data.Models.session.unset("password", {silent: true});		
			},
			error: function (response, model){
				Data.Models.session.unset("password", {silent: true});
			}
		}
		);		
	},
	
	logout: function (){
		
	}
})
