App.Collections.Users = App.Collections.BaseCollection.extend({
	model: App.Models.User,
	url: "/api/v1/users/",
	parse: function (response){
		this.limit = response.meta.limit;
		this.next = response.meta.next;
		this.offset = response.meta.offset;
		this.previous = response.meta.previous;
		this.total_count = response.meta.total_count;
		
		objects = _.map(response.objects, function(user){
			user.name = user.first_name + " " + user.last_name;
			return user
		});
		
		return response.objects;
	},
	limit: 0,
	next: null, 
	offset: 0, 
	previous: null, 
	total_count: 0	
});
