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

// invitation item view
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


// admin users list item view

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
		location = "/#!/admin/user/" + this.model.id;
	},
	
	remove: function (){
		log('remove');
	}
	
}); 


// Admin user list

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
		$(this.el).html(JST.admin_users_list({role: this.options.role}));
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
		if (this.options.role == undefined){
			this.options.role = "admins";
		}
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
		
		$(".invitation-form", this.el).html(JST.invite_user_form({role: this.options.role}));				
		Data.Collections.invitations = new App.Collections.Invitations();
		Data.Collections.invitations.fetch(
			{
				success: function (collection, response){
					view.invitations = new App.Views.Invitations({el: ".invitations-pending", collection: collection, role: view.options.role});
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
					role: this.options.role
				},
				success: function (collection, response){
					view.adminUsers = new App.Views.AdminUsersList({el: ".admin-users-list", collection: collection, role: view.options.role});
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
		var role = view.options.role;
		var invitation = new App.Models.Invitation();
		invitation.save({
				email: email,
				role: role	
			},{
				success: function(model, response){
					$("input[name=email]", this.el).val("");
					$('#send-success').modal('show');
					view.invitations.addOne(model);
				},
				error: function(model, response){
					$('#send-error').modal('show');
				}
		});
	}
});


// User profile view

App.Views.UserProfileView = Backbone.View.extend({
	tagName: "div",
	className: "admin-content",

	initialize: function (){
		_.bindAll(this, 'render', 'edit', 'remove');	
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser	
		}
		
		this.render();	
	},
	
	events: {
		"click .edit-profile":	"edit",
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
	
	edit: function (){
		location = "/#!/admin/user/" + this.model.id + "/edit";	
	},
	
	remove: function (){
		log('remove');
	},
	
}); 


// user profile edit view

App.Views.UserProfileEditView = Backbone.View.extend({
	tagName: "div",
	className: "admin-content",

	initialize: function (){
		_.bindAll(this, 'render', 'save', 'cancel');
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser	
		}	
		this.render();	
	},
	
	events: {
		"click .save":	"save",
		"click .cancel":	"cancel",
	},

	render: function(){
		this.avatar();
		this.checkUser();
		$(this.el).html(JST.user_profile_edit({model: this.model}));
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
	
	save: function (e){
		var view = this;
		try{
			e.preventDefault();
		}catch(e){}
		var data = {
			first_name: $("input[name=first_name]", this.el).val(),
			last_name: $("input[name=last_name]", this.el).val(),
			twitter: $("input[name=twitter]", this.el).val(),
			bio: $("input[name=bio]", this.el).val(),
			role: $("select[name=role]", this.el).val()
			,
		};
		this.model.save(data, {
			success: function (model, response){
				Data.Routers.router.navigate("/#!/admin/user/" + model.id, true);
			},
			error: function (model, response) {
				if (response.status != undefined){
					errors = response.users;
					if (response.status != 400){
						$("#save-error").modal("show");
					}
				}else{
					errors = response;
				}
				if (errors.first_name != undefined){
					$(".help-block", ".first-name").removeClass("hide");
					$(".first-name").addClass("error");
				}else{
					$(".help-block", ".first-name").addClass("hide");
					$(".first-name").removeClass("error");
				}
				if (errors.last_name != undefined){
					$(".help-block", ".last-name").removeClass("hide");
					$(".last-name").addClass("error");
				}else{
					$(".help-block", ".last-name").addClass("hide");
					$(".last-name").removeClass("error");
				}				
			}
		}); 	
	},

	validate: function (){
		
	},
	
	cancel: function (e){
		try{
			e.preventDefault();
		}catch(e){}
		Data.Routers.router.navigate("/#!/admin/user/" + this.model.id, true);
	}	
	
}); 
 

// Ideas admin view

App.Views.Idea = Backbone.View.extend({
	tagName: "tr",
	className: "idea",

	initialize: function (){
		_.bindAll(this, 'render', 'detail', 'remove');
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser	
		}	
		this.render();	
	},
	
	events: {
		"click": 	"detail",
		"click .vote": "vote",
		"click .edit": "edit",		
		"click .remove":	"remove",
	},

	render: function(){
		this.avatar();
		this.checkUser();				
		$(this.el).html(JST.idea_row({model: this.model}));
		return this;
	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.get("participant").email);
		this.model.avatar = gravatar_url;
	},	
	
	checkUser: function (){
		if ((this.loggedUser != undefined && this.loggedUser.id == this.model.id) || this.loggedUser.get("role") == "admins"){
			this.model.canEdit = true;
		}else{
			this.model.canEdit = false;
		}
	},
	
	vote: function (){
		var view = this;
		Data.Models.vote = new App.Models.Vote();
		Data.Models.vote.save({
			user: Data.Models.account.id,
			type: "idea",
			type_id: this.model.id
		},{
			success: function (model, response){
				view.model.set({"votes": view.model.get("votes") + 1}, {silent: true});
				view.render();
				$("#vote-success").modal("show");
			},
			error: function (model, response){
				$("#vote-error").modal("show");
			}
		});
	},
	
	detail: function (e){
		if($(".edit", this.el).is(':visible') || $(".vote", this.el).is(':visible') ){
			log("entro");
			e.preventDefault();
			return;	
		}else{
			this.profile();
		}
	},
	
	edit: function (){
		location = "/#!/admin/idea/" + this.model.id + "/edit";	
	},
	
	profile: function (){
		location = "/#!/admin/idea/" + this.model.id;
	},
	
	remove: function (){
		log('remove');
	}
	
}); 



App.Views.Ideas = Backbone.View.extend({
	tagName: "div",
	className: "participants-ideas",
	
	initialize: function (){
		_.bindAll(this, 'render', 'addOne', 'addAll');
		this.render();	
	},
	
	events: {
		"click .refresh":	"render",
	},
	
	render: function(){				
		$(this.el).html(JST.admin_ideas_list());
		this.addAll();
	},
	
	addOne: function (idea){
		var view = new App.Views.Idea({model: idea});
		$('table', this.el).append(view.render().el);
	},
	
	addAll: function (){
		this.collection.each(this.addOne);	
	}
	
});
 


App.Views.AdminIdeas = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render');
		this.render();	
	},
	
	events: {
		"click .create":	"create",
	},
	
	render: function(){				
		var view = this;
		$(this.el).html(JST.admin_ideas());
		
		/*
		 * Load form and admin user invitations
		 */
		
		$(".idea-form", this.el).html(JST.idea_create_form());
		
		$('#create-idea', this.el).on('hidden', function (e) {
  			$('.create-idea-twisty').html("Create new Idea");
		});
		
		$('#create-idea', this.el).on('shown', function (e) {
  			$('.create-idea-twisty').html("Hide form");
		});
							
		Data.Collections.ideas = new App.Collections.Ideas();
		Data.Collections.ideas.fetch(
			{
				success: function (collection, response){
					view.ideas = new App.Views.Ideas({el: ".participants-ideas", collection: collection});
				},
				error: function (collection, response){
					
				}
			}
		);	

		/*
		 * This autocomplete was the result of the modification of 
		 * https://github.com/twitter/bootstrap/issues/1336
		 * 
		 * http://stackoverflow.com/questions/9232748/twitter-bootstrap-typeahead-ajax-example
		 * 
		 * This can be add to bootstrap-typehead.js wiht a little bit of work :P
		 * 
		 * This autocomplete allows:
		 * 		- custom items layout
		 *  	- search matches result in more the one field when array you have of objes as response
		 *      - cache querys
		 * 
		 */
		var cache = {},lastXhr;
		$('input[name=search-participant]', this.el).typeahead({
			property: ["email", "name"],
		    source: function (typeahead, query) {

                var term = query;
                if ( term in cache ) {
                    typeahead.process( cache[ term ] );
                    return;
                }
                var result = [];

                var users = new App.Collections.Users();
                users.fetch({
					data: {
						q: term,
					},
                    success: function (collection, data){
                        cache[ term ] = data.objects;
						lastXhr = data;						                        
                        typeahead.process(data.objects);
                    },
                });
    		},
			select: function () {
			      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
			        , text
			
			      if (!this.strings) {
				  	  if (typeof this.options.property != "string") {
					  	text = val[val["match"]]
					  }
					  else {
					  	text = val[this.options.property]
					  }
			      }else {text = val}
			
			      this.$element.val(text)
				  this.$element.attr('data-value', JSON.stringify(val))
				  avatar = Gravatar(val["email"])
				  $(".gravatar", view.el).attr("src", avatar)
				  $("input[name=participant]", view.el).val(val["id"])
			      if (typeof this.onselect == "function")
			          this.onselect(val)
			
			      return this.hide()
      
	     	},
			process: function (results) {
				var that = this
					, items
					, q
				
				if (results.length && typeof results[0] != "string")
					this.strings = false
				
				this.query = this.$element.val()
				
				if (!this.query) {
					return this.shown ? this.hide() : this
				}
				
				items = _.map(results, function (item) {
					if (!that.strings) 
						if (typeof that.options.property != "string") {
							match = _.find(that.options.property, function(property){
								text = item[property]
								if (that.matcher(text)) 
									return text
							})
							if (match) {
								item.match = match
								return item
							}
						}
						else {
							text = item[that.options.property]
							if (that.matcher(text)) 
								return item
						}
				})
				
				items = _.filter(items, function (item){
					return item != undefined;
				})
				
				items = this.sorter(items)
				
				if (!items.length) {
					return this.shown ? this.hide() : this
				}
				
				return this.render(items.slice(0, this.options.items)).show()
		    },
			
			sorter: function (items) {
			    var beginswith = []
			        , caseSensitive = []
			        , caseInsensitive = []
			        , item
			        , sortby
			
			    while (item = items.shift()) {
			        if (this.strings) 
						sortby = item
			        else
						if (typeof this.options.property == "object")
							sortby = item[item.match]
						else 
							sortby = item[this.options.property]
			
			        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			        else caseInsensitive.push(item)
			    }
			
			    return beginswith.concat(caseSensitive, caseInsensitive)
			},
			
			render: function (items) {
      			var that = this
				
				items = $(items).map(function (i, item) {
					i = $(that.options.item).attr('data-value', JSON.stringify(item))
					if (!that.strings)
						if (typeof that.options.property == "object")
							text = item[item.match]
						else
					    	text = item[that.options.property]
					avatar = Gravatar(item.email)
					i.find('a').html("<img src='" + avatar + "?size=30'/> " + that.highlighter(text))
					log(i)
					return i[0]
				})
				
				items.first().addClass('active')
				this.$menu.html(items)
				return this
		    }
		});

		
			
	},
	
	create: function (e){
		var view = this;
		try{
			e.preventDefault();	
		}catch (e){}
		var name = $("input[name=name]", this.el).val();
		var participant = $("input[name=participant]", this.el).val();;
		var description = $("textarea[name=description]", this.el).val();;
		var idea = new App.Models.Idea();
		idea.save({
				name: name,
				participant: participant, 
				description: description	
			},{
				success: function(model, response){
					$('#send-success').modal('show');
					view.clean_fields();
					view.validate({});
					view.ideas.addOne(model);
				},
				error: function(model, response){			
					if (response.status != undefined){
						errors = response.ideas;
						if (response.status != 400){
							$('#send-error').modal('show');
						}
					}else{
						errors = response;
					}
					view.validate(errors);
				}
		});
	},
	
	clean_fields: function (){		
		var name = $("input[name=name]", this.el).val("");
		var participant = $("input[name=participant]", this.el).val("");
		var description = $("textarea[name=description]", this.el).val("");
	},
	
	validate: function (errors){
		var view = this;
		if (errors.name != undefined){
			//$(".help-block", ".name").removeClass("hide");
			$(".name", view.el).addClass("error");
		}else{
			//$(".help-block", ".first-name").addClass("hide");
			$(".name", view.el).removeClass("error");
		}
		if (errors.participant != undefined){
			//$(".help-block", ".last-name").removeClass("hide");
			$(".participant", view.el).addClass("error");
		}else{
			//$(".help-block", ".last-name").addClass("hide");
			$(".participant", view.el).removeClass("error");
		}
		if (errors.description != undefined){
			//$(".help-block", ".last-name").removeClass("hide");
			$(".description", view.el).addClass("error");
		}else{
			//$(".help-block", ".last-name").addClass("hide");
			$(".description", view.el).removeClass("error");
		}
	}
}); 


App.Views.AdminIdea = Backbone.View.extend({
	tagName: "div",
	className: "admin-content",

	initialize: function (){
		_.bindAll(this, 'render', 'avatar', 'checkUser', 'vote');
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser;	
		}
		this.render();	
	},
	
	events: {
		"click .vote":	"vote",
		"click .remove": "remove",
	},
	
	render: function(){				
		var view = this;
		this.avatar();
		this.checkUser();
		$(this.el).html(JST.idea_detail({model: this.model}));

	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.get("participant").email);
		this.model.avatar = gravatar_url;
	},	
	
	checkUser: function (){
		if ((this.loggedUser != undefined && this.loggedUser.id == this.model.id) || this.loggedUser.get("role") == "admins"){
			this.model.canEdit = true;
		}else{
			this.model.canEdit = false;
		}
	},
	
	vote: function (){
		var view = this;
		Data.Models.vote = new App.Models.Vote();
		Data.Models.vote.save({
			user: Data.Models.account.id,
			type: "idea",
			type_id: this.model.id
		},{
			success: function (model, response){
				view.model.set({"votes": view.model.get("votes") + 1}, {silent: true});
				view.render();
				$("#vote-success").modal("show");
				
				
			},
			error: function (model, response){
				$("#vote-error").modal("show");
			}
		});
	},	
	
	remove: function (){
		this.model.destroy({
			success: function (model, response){
				Data.Routers.router.navigate("/#!/admin/ideas", true);
			},
			error: function (model, response){
				alert("Error deleting idea.\n Try again later.");
			}
		});
	}
});


App.Views.AdminIdeaEdit = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render');
		this.render();	
	},
	
	events: {
		"click .save":	"save",
		"click .cancel":	"cancel",
	},
	
	render: function(){				
		var view = this;
		this.avatar(this.model.get("participant").email);		
		$(this.el).html(JST.idea_edit({model: this.model}));
		
		/*
		 * This autocomplete was the result of the modification of 
		 * https://github.com/twitter/bootstrap/issues/1336
		 * 
		 * http://stackoverflow.com/questions/9232748/twitter-bootstrap-typeahead-ajax-example
		 * 
		 * This can be add to bootstrap-typehead.js wiht a little bit of work :P
		 * 
		 * This autocomplete allows:
		 * 		- custom items layout
		 *  	- search matches result in more the one field when array you have of objes as response
		 *      - cache querys
		 * 
		 */
        var cache = {},lastXhr;
		
		$('input[name=search-participant]', this.el).typeahead({
			property: ["email", "name"],
		    source: function (typeahead, query) {

                var term = query;
                if ( term in cache ) {
                    typeahead.process( cache[ term ] );
                    return;
                }
                var result = [];

                var users = new App.Collections.Users();
                users.fetch({
					data: {
						q: term,
					},
                    success: function (collection, data){
                        cache[ term ] = data.objects;
						lastXhr = data;						                        
                        typeahead.process(data.objects);
                    },
                });
    		},
			select: function () {
			      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
			        , text
			
			      if (!this.strings) {
				  	  if (typeof this.options.property != "string") {
					  	text = val[val["match"]]
					  }
					  else {
					  	text = val[this.options.property]
					  }
			      }else {text = val}
			
			      this.$element.val(text)
				  this.$element.attr('data-value', JSON.stringify(val))
				  avatar = Gravatar(val["email"])
				  $(".gravatar", view.el).attr("src", avatar)
				  $("input[name=participant]", view.el).val(val["id"])
			      if (typeof this.onselect == "function")
			          this.onselect(val)
			
			      return this.hide()
      
	     	},
			process: function (results) {
				var that = this
					, items
					, q
				
				if (results.length && typeof results[0] != "string")
					this.strings = false
				
				this.query = this.$element.val()
				
				if (!this.query) {
					return this.shown ? this.hide() : this
				}
				
				items = _.map(results, function (item) {
					if (!that.strings) 
						if (typeof that.options.property != "string") {
							match = _.find(that.options.property, function(property){
								text = item[property]
								if (that.matcher(text)) 
									return text
							})
							if (match) {
								item.match = match
								return item
							}
						}
						else {
							text = item[that.options.property]
							if (that.matcher(text)) 
								return item
						}
				})
				
				items = _.filter(items, function (item){
					return item != undefined;
				})
				
				items = this.sorter(items)
				
				if (!items.length) {
					return this.shown ? this.hide() : this
				}
				
				return this.render(items.slice(0, this.options.items)).show()
		    },
			
			sorter: function (items) {
			    var beginswith = []
			        , caseSensitive = []
			        , caseInsensitive = []
			        , item
			        , sortby
			
			    while (item = items.shift()) {
			        if (this.strings) 
						sortby = item
			        else
						if (typeof this.options.property == "object")
							sortby = item[item.match]
						else 
							sortby = item[this.options.property]
			
			        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			        else caseInsensitive.push(item)
			    }
			
			    return beginswith.concat(caseSensitive, caseInsensitive)
			},
			
			render: function (items) {
      			var that = this
				
				items = $(items).map(function (i, item) {
					i = $(that.options.item).attr('data-value', JSON.stringify(item))
					if (!that.strings)
						if (typeof that.options.property == "object")
							text = item[item.match]
						else
					    	text = item[that.options.property]
					avatar = Gravatar(item.email)
					i.find('a').html("<img src='" + avatar + "?size=30'/> " + that.highlighter(text))
					log(i)
					return i[0]
				})
				
				items.first().addClass('active')
				this.$menu.html(items)
				return this
		    }
		});
	},
	
	// get the gravatar url
	avatar: function (){
		gravatar_url = Gravatar(this.model.get("participant").email);
		this.model.avatar = gravatar_url;
	},	
	
	save: function (e){
		var view = this;
		try{
			e.preventDefault();	
		}catch (e){}
		var name = $("input[name=name]", this.el).val();
		var participant = $("input[name=participant]", this.el).val();;
		var description = $("textarea[name=description]", this.el).val();;
		
		this.model.save({
				name: name,
				participant: participant, 
				description: description	
			},{
				success: function(model, response){
					Data.Routers.router.navigate("/#!/admin/idea/" + model.id, true);
				},
				error: function(model, response){			
					if (response.status != undefined){
						errors = response.ideas;
						if (response.status != 400){
							$('#send-error').modal('show');
						}
					}else{
						errors = response;
					}
					view.validate(errors);
				}
		});
	},
	
	cancel: function (e){
		try{
			e.preventDefault();	
		}catch (e){}
		Data.Routers.router.navigate("/#!/admin/idea/" + this.model.id, true);
	},
	
	clean_fields: function (){		
		var name = $("input[name=name]", this.el).val("");
		var participant = $("input[name=participant]", this.el).val("");
		var description = $("textarea[name=description]", this.el).val("");
	},
	
	validate: function (errors){
		var view = this;
		if (errors.name != undefined){
			$(".name", view.el).addClass("error");
		}else{
			$(".name", view.el).removeClass("error");
		}
		if (errors.participant != undefined){
			$(".participant", view.el).addClass("error");
		}else{
			$(".participant", view.el).removeClass("error");
		}
		if (errors.description != undefined){
			$(".description", view.el).addClass("error");
		}else{
			$(".description", view.el).removeClass("error");
		}
	}
}); 



/*
 * 
 * Projects views
 * 
 */

App.Views.Project = Backbone.View.extend({
	tagName: "tr",
	className: "project",

	initialize: function (){
		_.bindAll(this, 'render', 'detail', 'remove');
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser	
		}	
		this.render();	
	},
	
	events: {
		"click": 	"detail",
		"click .name":	"profile",
		"click .vote": "vote",
		"click .edit": "edit",		
		"click .remove":	"remove",
	},

	render: function(){
		this.checkUser();
		$(this.el).html(JST.project_row({model: this.model}));
		return this;
	},
	
	avatar: function (email){
		gravatar_url = Gravatar(email);
		return gravatar_url;
	},
	
	checkUser: function (){
		var view = this;
		if (this.loggedUser != undefined) {
			team_member = $.grep(this.model.get("team"), function (item){if(item.id == view.loggedUser.id) return item;});			
			if (team_member.length >= 1 || this.loggedUser.id == this.model.get("owner").id || this.loggedUser.get("role") == "admins") {
				this.model.canEdit = true;
			}
			else {
				this.model.canEdit = false;	
			}
		}else{
			this.model.canEdit = false;
		}
	},
	
	vote: function (){
		var view = this;
		Data.Models.vote = new App.Models.Vote();
		Data.Models.vote.save({
			user: Data.Models.account.id,
			type: "project",
			type_id: this.model.id
		},{
			success: function (model, response){
				view.model.set({"votes": view.model.get("votes") + 1}, {silent: true});
				view.render();
				$("#vote-success").modal("show");
			},
			error: function (model, response){
				$("#vote-error").modal("show");
			}
		});
	},
	
	detail: function (e){
		if($(".edit", this.el).is(':visible') || $(".vote", this.el).is(':visible') ){
			log("entro");
			e.preventDefault();
			return;	
		}else{
			this.profile();
		}
	},
	
	edit: function (){
		location = "/#!/admin/project/" + this.model.id + "/edit";	
	},
	
	profile: function (){
		location = "/#!/admin/project/" + this.model.id;
	},
	
	remove: function (){
		log('remove');
	}
	
}); 



App.Views.Projects = Backbone.View.extend({
	tagName: "div",
	className: "participants-projects",
	
	initialize: function (){
		_.bindAll(this, 'render', 'addOne', 'addAll');
		this.render();	
	},
	
	events: {
		"click .refresh":	"render",
	},
	
	render: function(){				
		$(this.el).html(JST.admin_projects_list());
		this.addAll();
	},
	
	addOne: function (project){
		var view = new App.Views.Project({model: project});
		$('table', this.el).append(view.render().el);
	},
	
	addAll: function (){
		this.collection.each(this.addOne);	
	}
	
});


App.Views.AdminProjects = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render');
		this.render();	
	},
	
	events: {
		"click .create":	"create",
	},
	
	render: function(){				
		var view = this;
		$(this.el).html(JST.admin_projects());
		
		/*
		 * Load form and projects list
		 */
		
		$(".project-form", this.el).html(JST.project_create_form());
							
		Data.Collections.projects = new App.Collections.Projects();
		Data.Collections.projects.fetch(
			{
				success: function (collection, response){
					view.projects = new App.Views.Projects({el: ".participants-projects", collection: collection});
				},
				error: function (collection, response){
					
				}
			}
		);	

		/*
		 * This autocomplete was the result of the modification of 
		 * https://github.com/twitter/bootstrap/issues/1336
		 * 
		 * http://stackoverflow.com/questions/9232748/twitter-bootstrap-typeahead-ajax-example
		 * 
		 * This can be add to bootstrap-typehead.js wiht a little bit of work :P
		 * 
		 * This autocomplete allows:
		 * 		- custom items layout
		 *  	- search matches result in more the one field when array you have of objes as response
		 *      - cache querys
		 * 
		 */
		var cache = {},lastXhr;
		$('input[name=search-owner]', this.el).typeahead({
			property: ["email", "name"],
		    source: function (typeahead, query) {

                var term = query;
                if ( term in cache ) {
                    typeahead.process( cache[ term ] );
                    return;
                }
                var result = [];

                var users = new App.Collections.Users();
                users.fetch({
					data: {
						q: term,
					},
                    success: function (collection, data){
                        cache[ term ] = data.objects;
						lastXhr = data;						                        
                        typeahead.process(data.objects);
                    },
                });
    		},
			select: function () {
			      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
			        , text
			
			      if (!this.strings) {
				  	  if (typeof this.options.property != "string") {
					  	text = val[val["match"]]
					  }
					  else {
					  	text = val[this.options.property]
					  }
			      }else {text = val}
			
			      this.$element.val(text)
				  this.$element.attr('data-value', JSON.stringify(val))
				  avatar = Gravatar(val["email"])
				  $(".gravatar", view.el).attr("src", avatar)
				  $("input[name=owner]", view.el).val(val["id"])
			      if (typeof this.onselect == "function")
			          this.onselect(val)
			
			      return this.hide()
      
	     	},
			process: function (results) {
				var that = this
					, items
					, q
				
				if (results.length && typeof results[0] != "string")
					this.strings = false
				
				this.query = this.$element.val()
				
				if (!this.query) {
					return this.shown ? this.hide() : this
				}
				
				items = _.map(results, function (item) {
					if (!that.strings) 
						if (typeof that.options.property != "string") {
							match = _.find(that.options.property, function(property){
								text = item[property]
								if (that.matcher(text)) 
									return text
							})
							if (match) {
								item.match = match
								return item
							}
						}
						else {
							text = item[that.options.property]
							if (that.matcher(text)) 
								return item
						}
				})
				
				items = _.filter(items, function (item){
					return item != undefined;
				})
				
				items = this.sorter(items)
				
				if (!items.length) {
					return this.shown ? this.hide() : this
				}
				
				return this.render(items.slice(0, this.options.items)).show()
		    },
			
			sorter: function (items) {
			    var beginswith = []
			        , caseSensitive = []
			        , caseInsensitive = []
			        , item
			        , sortby
			
			    while (item = items.shift()) {
			        if (this.strings) 
						sortby = item
			        else
						if (typeof this.options.property == "object")
							sortby = item[item.match]
						else 
							sortby = item[this.options.property]
			
			        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			        else caseInsensitive.push(item)
			    }
			
			    return beginswith.concat(caseSensitive, caseInsensitive)
			},
			
			render: function (items) {
      			var that = this
				
				items = $(items).map(function (i, item) {
					i = $(that.options.item).attr('data-value', JSON.stringify(item))
					if (!that.strings)
						if (typeof that.options.property == "object")
							text = item[item.match]
						else
					    	text = item[that.options.property]
					avatar = Gravatar(item.email)
					i.find('a').html("<img src='" + avatar + "?size=30'/> " + that.highlighter(text))
					log(i)
					return i[0]
				})
				
				items.first().addClass('active')
				this.$menu.html(items)
				return this
		    }
		});

		
			
	},
	
	create: function (e){
		var view = this;
		try{
			e.preventDefault();	
		}catch (e){}
		var name = $("input[name=name]", this.el).val();
		var participant = $("input[name=owner]", this.el).val();;
		var description = $("textarea[name=description]", this.el).val();;
		var project = new App.Models.Project();
		project.save({
				name: name,
				owner: participant, 
				description: description	
			},{
				success: function(model, response){
					$('#send-success').modal('show');
					view.clean_fields();
					view.validate({});
					view.projects.addOne(model);
				},
				error: function(model, response){			
					if (response.status != undefined){
						errors = response.ideas;
						if (response.status != 400){
							$('#send-error').modal('show');
						}
					}else{
						errors = response;
					}
					view.validate(errors);
				}
		});
	},
	
	clean_fields: function (){		
		var name = $("input[name=name]", this.el).val("");
		var participant = $("input[name=owner]", this.el).val("");
		var description = $("textarea[name=description]", this.el).val("");
	},
	
	validate: function (errors){
		var view = this;
		if (errors.name != undefined){
			$(".name", view.el).addClass("error");
		}else{
			$(".name", view.el).removeClass("error");
		}
		if (errors.participant != undefined){
			$(".owner", view.el).addClass("error");
		}else{
			$(".owner", view.el).removeClass("error");
		}
	}
}); 

App.Views.AdminProject = Backbone.View.extend({
	tagName: "div",
	className: "admin-content",

	initialize: function (){
		_.bindAll(this, 'render', 'checkUser', 'vote');
		if (this.options.loggedUser == undefined){
			this.loggedUser = (Data.Models.account == undefined ? new App.Models.Account() : Data.Models.account); 
		}else{
			this.loggedUser = this.options.loggedUser;	
		}
		this.render();	
	},
	
	events: {
		"click .vote":	"vote",
		"click .remove": "remove",
	},
	
	render: function(){				
		var view = this;
		this.checkUser();
		$(this.el).html(JST.project_detail({model: this.model}));
		$(".tweets", this.el).tweet({
			join_text: "auto",
			username: this.model.get("twitter"),
			avatar_size: 48,
			count: 5,
			auto_join_text_default: "we said,",
			auto_join_text_ed: "we",
			auto_join_text_ing: "we were",
			auto_join_text_reply: "we replied",
			auto_join_text_url: "we were checking out",
			loading_text: "loading tweets..."
       });
	},
	
	checkUser: function (){
		var view = this;
		if (this.loggedUser != undefined) {
			team_member = $.grep(this.model.get("team"), function (item){if(item.id == view.loggedUser.id) return item;});			
			if (team_member.length >= 1 || this.loggedUser.id == this.model.get("owner").id || this.loggedUser.get("role") == "admins") {
				this.model.canEdit = true;
			}
			else {
				this.model.canEdit = false;	
			}
		}else{
			this.model.canEdit = false;
		}
	},
	
	vote: function (){
		var view = this;
		Data.Models.vote = new App.Models.Vote();
		Data.Models.vote.save({
			user: Data.Models.account.id,
			type: "project",
			type_id: this.model.id
		},{
			success: function (model, response){
				view.model.set({"votes": view.model.get("votes") + 1}, {silent: true});
				view.render();
				$("#vote-success").modal("show");
				
				
			},
			error: function (model, response){
				$("#vote-error").modal("show");
			}
		});
	},	
	
	
	remove: function (){
		this.model.destroy({
			success: function (model, response){
				Data.Routers.router.navigate("/#!/admin/projects", true);
			},
			error: function (model, response){
				alert("Error deleting idea.\n Try again later.");
			}
		});
	}
});


App.Views.AdminProjectEdit = Backbone.View.extend({

	initialize: function (){
		_.bindAll(this, 'render', 'addMember');
		this.render();	
	},
	
	events: {
		"click .save":	"save",
		"click .cancel":	"cancel",
		"click .add-member": "addMember",
	},
	
	addMember: function (){
		var view = this;
		var member_id = $("input[name=possible-member]", view.el).val();
		if (member_id != ""){
			var val = JSON.parse($('input[name=search-member]', this.el).attr("data-value"));			
			$(".team .members", view.el).append(JST.project_edit_member({model: val}));
		}
	},
	
	projectImage: function (){
		var twitter = $("input[name=twitter]", this.el).val();
		if(twitter != ""){
			$(".project-img", this.el).attr("src", "https://api.twitter.com/1/users/profile_image?size=bigger&screen_name=" + twitter);
		}
	},
	
	render: function(){				
		var view = this;
		this.model.get("owner").avatar = this.avatar(this.model.get("owner").email);		
		$(this.el).html(JST.project_edit({model: this.model}));
					
		this.projectImage();
					
		_.each(this.model.get('team'), function (member){
			$(".team .members", view.el).append(JST.project_edit_member({model: member}));
		});
		
		/*
		 * This autocomplete was the result of the modification of 
		 * https://github.com/twitter/bootstrap/issues/1336
		 * 
		 * http://stackoverflow.com/questions/9232748/twitter-bootstrap-typeahead-ajax-example
		 * 
		 * This can be add to bootstrap-typehead.js wiht a little bit of work :P
		 * 
		 * This autocomplete allows:
		 * 		- custom items layout
		 *  	- search matches result in more the one field when array you have of objes as response
		 *      - cache querys
		 * 
		 */
        var cache = {},lastXhr;
		
		$('input[name=search-owner]', this.el).typeahead({
			property: ["email", "name"],
		    source: function (typeahead, query) {

                var term = query;
                if ( term in cache ) {
                    typeahead.process( cache[ term ] );
                    return;
                }
                var result = [];

                var users = new App.Collections.Users();
                users.fetch({
					data: {
						q: term,
					},
                    success: function (collection, data){
                        cache[ term ] = data.objects;
						lastXhr = data;						                        
                        typeahead.process(data.objects);
                    },
                });
    		},
			select: function () {
			      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
			        , text
			
			      if (!this.strings) {
				  	  if (typeof this.options.property != "string") {
					  	text = val[val["match"]]
					  }
					  else {
					  	text = val[this.options.property]
					  }
			      }else {text = val}
			
			      this.$element.val(text)
				  this.$element.attr('data-value', JSON.stringify(val))
				  avatar = Gravatar(val["email"])
				  $(".gravatar", view.el).attr("src", avatar)
				  $("input[name=owner]", view.el).val(val["id"])
			      if (typeof this.onselect == "function")
			          this.onselect(val)
			
			      return this.hide()
      
	     	},
			process: function (results) {
				var that = this
					, items
					, q
				
				if (results.length && typeof results[0] != "string")
					this.strings = false
				
				this.query = this.$element.val()
				
				if (!this.query) {
					return this.shown ? this.hide() : this
				}
				
				items = _.map(results, function (item) {
					if (!that.strings) 
						if (typeof that.options.property != "string") {
							match = _.find(that.options.property, function(property){
								text = item[property]
								if (that.matcher(text)) 
									return text
							})
							if (match) {
								item.match = match
								return item
							}
						}
						else {
							text = item[that.options.property]
							if (that.matcher(text)) 
								return item
						}
				})
				
				items = _.filter(items, function (item){
					return item != undefined;
				})
				
				items = this.sorter(items)
				
				if (!items.length) {
					return this.shown ? this.hide() : this
				}
				
				return this.render(items.slice(0, this.options.items)).show()
		    },
			
			sorter: function (items) {
			    var beginswith = []
			        , caseSensitive = []
			        , caseInsensitive = []
			        , item
			        , sortby
			
			    while (item = items.shift()) {
			        if (this.strings) 
						sortby = item
			        else
						if (typeof this.options.property == "object")
							sortby = item[item.match]
						else 
							sortby = item[this.options.property]
			
			        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			        else caseInsensitive.push(item)
			    }
			
			    return beginswith.concat(caseSensitive, caseInsensitive)
			},
			
			render: function (items) {
      			var that = this
				
				items = $(items).map(function (i, item) {
					i = $(that.options.item).attr('data-value', JSON.stringify(item))
					if (!that.strings)
						if (typeof that.options.property == "object")
							text = item[item.match]
						else
					    	text = item[that.options.property]
					avatar = Gravatar(item.email)
					i.find('a').html("<img src='" + avatar + "?size=30'/> " + that.highlighter(text))
					log(i)
					return i[0]
				})
				
				items.first().addClass('active')
				this.$menu.html(items)
				return this
		    }
		});
		
		/*
		 * add new member to project
		 */
		$('input[name=search-member]', this.el).typeahead({
			property: ["email", "name"],
		    source: function (typeahead, query) {

                var term = query;
                if ( term in cache ) {
                    typeahead.process( cache[ term ] );
                    return;
                }
                var result = [];

                var users = new App.Collections.Users();
                users.fetch({
					data: {
						q: term,
					},
                    success: function (collection, data){
                        cache[ term ] = data.objects;
						lastXhr = data;						                        
                        typeahead.process(data.objects);
                    },
                });
    		},
			select: function () {
			      var val = JSON.parse(this.$menu.find('.active').attr('data-value'))
			        , text
			
			      if (!this.strings) {
				  	  if (typeof this.options.property != "string") {
					  	text = val[val["match"]]
					  }
					  else {
					  	text = val[this.options.property]
					  }
			      }else {text = val}
			
			      this.$element.val(text)
				  this.$element.attr('data-value', JSON.stringify(val))
				  avatar = Gravatar(val["email"])
				  $(".gravatar", view.el).attr("src", avatar + "?size=40")
				  $("input[name=possible-member]", view.el).val(val["id"])
			      if (typeof this.onselect == "function")
			          this.onselect(val)
			
			      return this.hide()
      
	     	},
			process: function (results) {
				var that = this
					, items
					, q
				
				if (results.length && typeof results[0] != "string")
					this.strings = false
				
				this.query = this.$element.val()
				
				if (!this.query) {
					return this.shown ? this.hide() : this
				}
				
				items = _.map(results, function (item) {
					if (!that.strings) 
						if (typeof that.options.property != "string") {
							match = _.find(that.options.property, function(property){
								text = item[property]
								if (that.matcher(text)) 
									return text
							})
							if (match) {
								item.match = match
								return item
							}
						}
						else {
							text = item[that.options.property]
							if (that.matcher(text)) 
								return item
						}
				})
				
				items = _.filter(items, function (item){
					return item != undefined;
				})
				
				items = this.sorter(items)
				
				if (!items.length) {
					return this.shown ? this.hide() : this
				}
				
				return this.render(items.slice(0, this.options.items)).show()
		    },
			
			sorter: function (items) {
			    var beginswith = []
			        , caseSensitive = []
			        , caseInsensitive = []
			        , item
			        , sortby
			
			    while (item = items.shift()) {
			        if (this.strings) 
						sortby = item
			        else
						if (typeof this.options.property == "object")
							sortby = item[item.match]
						else 
							sortby = item[this.options.property]
			
			        if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			        else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			        else caseInsensitive.push(item)
			    }
			
			    return beginswith.concat(caseSensitive, caseInsensitive)
			},
			
			render: function (items) {
      			var that = this
				
				items = $(items).map(function (i, item) {
					i = $(that.options.item).attr('data-value', JSON.stringify(item))
					if (!that.strings)
						if (typeof that.options.property == "object")
							text = item[item.match]
						else
					    	text = item[that.options.property]
					avatar = Gravatar(item.email)
					i.find('a').html("<img src='" + avatar + "?size=30'/> " + that.highlighter(text))
					log(i)
					return i[0]
				})
				
				items.first().addClass('active')
				this.$menu.html(items)
				return this
		    }
		});
		
	},
	
	// get the gravatar url
	avatar: function (email){
		gravatar_url = Gravatar(email);
		return gravatar_url;
	},	
	
	save: function (e){
		var view = this;
		try{
			e.preventDefault();	
		}catch (e){}
		var name = $("input[name=name]", this.el).val();
		var participant = $("input[name=owner]", this.el).val();;
		var description = $("textarea[name=description]", this.el).val();;
		
		this.model.save({
				name: name,
				owner: participant, 
				description: description	
			},{
				success: function(model, response){
					Data.Routers.router.navigate("/#!/admin/project/" + model.id, true);
				},
				error: function(model, response){			
					if (response.status != undefined){
						errors = response.ideas;
						if (response.status != 400){
							$('#send-error').modal('show');
						}
					}else{
						errors = response;
					}
					view.validate(errors);
				}
		});
	},
	
	cancel: function (e){
		try{
			e.preventDefault();	
		}catch (e){}
		Data.Routers.router.navigate("/#!/admin/project/" + this.model.id, true);
	},
	
	clean_fields: function (){		
		var name = $("input[name=name]", this.el).val("");
		var participant = $("input[name=owner]", this.el).val("");
		var description = $("textarea[name=description]", this.el).val("");
	},
	
	validate: function (errors){
		var view = this;
		if (errors.name != undefined){
			$(".name", view.el).addClass("error");
		}else{
			$(".name", view.el).removeClass("error");
		}
		if (errors.participant != undefined){
			$(".owner", view.el).addClass("error");
		}else{
			$(".owner", view.el).removeClass("error");
		}
	}
}); 
