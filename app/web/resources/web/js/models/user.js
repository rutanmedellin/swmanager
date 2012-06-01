App.Models.User = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/users/"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + "/";
	},
	
	parse: function (response){
		return response;
	},
	
});
