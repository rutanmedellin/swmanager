App.Models.Session = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/sessions"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	validate: function (attrs){
		if (attrs.username == undefined){
			return "Username required";
		}
		if (attrs.password == undefined){
			return "Password required";
		}
	},
	
	parse: function (response){
		return response;
	}
	
});
