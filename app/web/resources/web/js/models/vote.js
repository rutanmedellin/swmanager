App.Models.Vote = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/votes/"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + "/";
	},
	
	parse: function (response){
		return response;
	},
	
	validate: function (attrs){
		var errors = {};
		var errors_count = 0;
		if(attrs.user == undefined || attrs.user == ""){
			errors.name = "User ID required";
			errors_count +=1;
		}
		if(attrs.type == undefined || attrs.type == ""){		
			errors.participant = "Type of vote required";
			errors_count +=1;
		}
		if(attrs.type_id == undefined || attrs.type_id == ""){		
			errors.description = "Type id of vote required";
			errors_count +=1;
		}
		if (errors_count){
			return errors;
		}
	}
	
});
