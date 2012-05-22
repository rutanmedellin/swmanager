App.Views.PublicProjects = Backbone.View.extend({
	tagName: "div",
	className: "container",
	initialize: function (){
		_.bindAll(this, 'render');
		this.render();		
	},
	
	events: {
		
	},
	
	render: function (){
		var view = this;
		$(this.el).html(JST.public_projects());
		
		Data.Collections.projects = new App.Collections.Projects();
		Data.Collections.projects.fetch(
			{
				success: function (collection, response){
					/*
					 * the App.Views.Projects is taken from the admin view
					 */
					view.projects = new App.Views.Projects({el: ".participants-projects", collection: collection});
				},
				error: function (collection, response){
					
				}
			}
		);	

	},
	
});


