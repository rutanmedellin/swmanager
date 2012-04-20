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

// invitation view
App.Views.Invitation = Backbone.View.extend({
	tagName: "tr",
	className: "invitation",
	
	initialize: function (){
		_.bindAll(this, 'render', 'avatar', 'resend', 'cancel');
		this.render();	
	},
	
	events: {
		"click .resend":	"resend",
		"click .cancel":	"cancel",
	},
	
	render: function(){
		this.avatar()				
		$(this.el).html(JST.user_invitation({model: this.model}));
		return this;
	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.escape("email"));
		this.model.set({avatar: gravatar_url},{silent: true});
	},
	
	resend: function (){
		
	},
	
	cancel: function (){
		
	}
}); 


// invitations view
App.Views.Invitations = Backbone.View.extend({
	tagName: "div",
	className: "invitations-pending",
	
	initialize: function (){
		_.bindAll(this, 'render', 'addOne', 'addAll');
		this.render();	
	},
	
	render: function(){
		admin_invitations = this.collection.where({type: this.options.type});	
		this.collection = new App.Collections.Invitations(admin_invitations);
		$(this.el).html(JST.invitations());					
		this.addAll();
	},
	
	addOne: function (invitation){
		var view = new App.Views.Invitation({model: invitation});
		$('table', this.el).append(view.render().el);
	},
	
	addAll: function(){
		this.collection.each(this.addOne);
	}
}); 

// admin users view
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
		Data.Collections.invitations = new App.Collections.Invitations();
		Data.Collections.invitations.fetch(
			{
				success: function (collection, response){
					new App.Views.Invitations({el: ".invitations-pending", collection: collection, type: "admin"});
				},
				error: function (collection, response){
					
				}
			}
		);
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






