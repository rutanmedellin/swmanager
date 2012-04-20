App.Views.Admin = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render');
		this.section = this.options.section;
		this.render();	
	},
	
	events: {

	},
	
	render: function(){
		$(this.el).html(JST.admin({model: this.model}));
		_.each($(".menu-item"), function (e){$(e).removeClass("active")});
		if (this.section != undefined){
			$("." + this.section, this.el).addClass("active");	
		}
	}
});

App.Views.AdminUsers = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render');
		this.render();	
	},
	
	events: {
		"click .invite":	"invite",
	},
	
	render: function(){				
		$(this.el).html(JST.admin_users());
		$(".invitation-form", this.el).html(JST.invite_user_form({role: "admin"}));
	},
	
	invite: function (e){
		var email = $("input[name=email]", this.el).val();
		var role = "admin";
		var invitation = new App.Models.Invitation();
		invitation.save({
				email: email,
				role: role	
			},{
				success: function (model, response ){
					
				},
				error: function (model, response){
					
				}
		});
		try{
			e.preventDefault();	
		}catch (e){}
				
	}
});






