App.Models.Session = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/sessions"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	validate: function (attrs){
		if (attrs.username == undefined || attrs.username == ""){
			return "Username required";
		}
		if (attrs.password == undefined || attrs.password == ""){
			return "Password required";
		}
	},
	
	parse: function (response){
		return response;
	}
	
});

App.Models.Account = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/users"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	parse: function (response){
		return response;
	}
	
});
