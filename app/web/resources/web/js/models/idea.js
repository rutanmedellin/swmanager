App.Models.Idea = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/ideas"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	parse: function (response){
		return response;
	},
	
	validate: function (attrs){
		var errors = {};
		var errors_count = 0;
		if(attrs.name == undefined || attrs.name == ""){
			errors.name = "Name required";
			errors_count +=1;
		}
		if(attrs.participant == undefined || attrs.participant == ""){		
			errors.participant = "Participant required";
			errors_count +=1;
		}
		if(attrs.description == undefined || attrs.description == ""){		
			errors.description = "Description required";
			errors_count +=1;
		}
		if (errors_count){
			return errors;
		}
	}
	
});
