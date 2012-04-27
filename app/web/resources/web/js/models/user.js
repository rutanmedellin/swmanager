App.Models.User = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/users"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	parse: function (response){
		return response;
	},
	
	validate: function (attrs){
		var errors = {};
		var errors_count = 0;
		if(attrs.first_name == undefined || attrs.first_name == ""){
			errors.first_name = "First name required";
			errors_count +=1;
		}
		if(attrs.last_name == undefined || attrs.last_name == ""){		
			errors.last_name = "Last name required";
			errors_count +=1;
		}
		if (errors_count){
			return errors;
		}
	}
	
});
