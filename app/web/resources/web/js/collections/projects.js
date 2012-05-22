App.Collections.Projects = App.Collections.BaseCollection.extend({
	model: App.Models.Project,
	url: "/api/v1/projects/",
	parse: function (response){
		this.limit = response.meta.limit;
		this.next = response.meta.next;
		this.offset = response.meta.offset;
		this.previous = response.meta.previous;
		this.total_count = response.meta.total_count;
		
		return response.objects;
	},
	comparator: function(project1, project2) {
		if (project1.get("votes") > project2.get("votes")){
			return -1;	
		}else if (project1.get("votes") == project2.get("votes")){
			return 0;
		}else{
			return 1;
		}
  	},
	limit: 0,
	next: null, 
	offset: 0, 
	previous: null, 
	total_count: 0	
});
