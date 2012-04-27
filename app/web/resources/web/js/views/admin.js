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
		this.model.bind("destroy", this.remove, this);
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
		this.model.avatar = gravatar_url;
	},
	
	resend: function (){
		if(this.model.isNew()){
			this.model.id = this.model.get("id");
		}
	
		this.model.save(
			{
				resend: true,
			},{
				success: function(model, response){
					log("success");
					$('#send-success').modal('show');
				},
				error: function(model, response){
					log("error");
					$('#send-error').modal('show');
				}
			}			
		);
	},
	
	cancel: function (){
		if(this.model.isNew()){
			this.model.id = this.model.get("id");
		}
	
		this.model.destroy();
	},
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
		admin_invitations = this.collection.where({role: this.options.role});	
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


// admin users list view

App.Views.AdminUserView = Backbone.View.extend({
	tagName: "tr",
	className: "user",

	initialize: function (){
		_.bindAll(this, 'render', 'detail', 'profile', 'remove');
		this.render();	
	},
	
	events: {
		"click": 	"detail",
		"click .profile":	"profile",
		"click .remove":	"remove",
	},

	render: function(){
		this.avatar()				
		$(this.el).html(JST.user_row({model: this.model}));
		return this;
	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.escape("email"));
		this.model.avatar = gravatar_url;
	},	
	
	detail: function (e){
		if($(".remove", this.el).is(':visible')){
			e.preventDefault();
			return;	
		}else{
			this.profile();
		}
	},
	
	profile: function (){
		alert("detail")
		log('detail');
	},
	
	remove: function (){
		log('remove');
	}
	
}); 

App.Views.AdminUsersList = Backbone.View.extend({

	tagName: "div",
	className: "admin-users-list",
	
	initialize: function (){
		_.bindAll(this, 'render', 'addOne', 'addAll');
		this.render();	
	},
	
	events: {
		"click .refresh":	"render",
	},
	
	render: function(){				
		$(this.el).html(JST.admin_users_list());
		this.addAll();
	},
	
	addOne: function (user){
		var view = new App.Views.AdminUserView({model: user});
		$('table', this.el).append(view.render().el);
	},
	
	addAll: function (){
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
		var view = this;
		$(this.el).html(JST.admin_users());
		
		/*
		 * Load form and admin user invitations
		 */
		
		$(".invitation-form", this.el).html(JST.invite_user_form({role: "admin"}));				
		Data.Collections.invitations = new App.Collections.Invitations();
		Data.Collections.invitations.fetch(
			{
				success: function (collection, response){
					view.invitations = new App.Views.Invitations({el: ".invitations-pending", collection: collection, role: "admin"});
				},
				error: function (collection, response){
					
				}
			}
		);
		
		/*
		 * load admin user list
		 */
		Data.Collections.adminUsers = new App.Collections.Users();
		Data.Collections.adminUsers.fetch(
			{				
				data: {
					role: "admin"
				},
				success: function (collection, response){
					view.adminUsers = new App.Views.AdminUsersList({el: ".admin-users-list", collection: collection, role: "admin"});
				},
				error: function (collection, response){
					
				}
			}
		);

	},
	
	invite: function (e){
		var view = this;
		try{
			e.preventDefault();	
		}catch (e){}
		var email = $("input[name=email]", this.el).val();
		var role = "admin";
		var invitation = new App.Models.Invitation();
		invitation.save({
				email: email,
				role: role	
			},{
				success: function(model, response){
					$('#send-success').modal('show');
					view.invitations.addOne(model);
				},
				error: function(model, response){
					$('#send-error').modal('show');
				}
		});
	}
});

App.Views.UserProfileView = Backbone.View.extend({
	tagName: "div",
	className: "admin-content",

	initialize: function (){
		_.bindAll(this, 'render', 'detail', 'profile', 'remove');	
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser	
		}
		
		this.render();	
	},
	
	events: {
		"click .profile":	"profile",
		"click .remove":	"remove",
	},

	render: function(){
		this.avatar()
		this.checkUser();				
		$(this.el).html(JST.user_profile_view({model: this.model}));
		return this;
	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.escape("email"));
		this.model.avatar = gravatar_url;
	},	
	
	checkUser: function (){
		if ((this.loggedUser != undefined && this.loggedUser.id == this.model.id) || this.loggedUser.get("role") == "admins"){
			this.model.canEdit = true;
		}else{
			this.model.canEdit = false;
		}
	},
	
	detail: function (e){
		if($(".remove", this.el).is(':visible')){
			e.preventDefault();
			return;	
		}else{
			this.profile();
		}
	},
	
	profile: function (){
		alert("detail")
		log('detail');
	},
	
	edit: function (){
		location = "/#!/users/" + this.model.id + "/edit";	
	},
	
	remove: function (){
		log('remove');
	},
	
}); 


// Admin account

 




