App.Models.Event = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/events/"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + "/";
	},
	
	parse: function (response){
		return response;
	},
	
	validate: function (attrs){
		var errors = {};
		var errors_count = 0;
		if(attrs.name == undefined || attrs.name == ""){
			errors.name = "Event name required";
			errors_count +=1;
		}
		if(attrs.url == undefined || attrs.url == ""){		
			errors.owner = "Event url required";
			errors_count +=1;
		}
		if (errors_count){
			return errors;
		}
	}
	
});

