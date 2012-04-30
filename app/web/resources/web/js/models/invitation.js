App.Models.Invitation = App.Models.BaseModel.extend({
	url: function (){
		var base = "/api/v1/invitations"
		if (this.isNew()) return base;
    	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
	},
	
	validate: function(attrs){
		if (typeof attrs.email != "string" && typeof attrs.role != "string"){
			return "Invalid format";
		}
		if(attrs.email == undefined || !attrs.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)){
			return "Email is requiered";
		}
		if(attrs.role == undefined || !attrs.role.match(/^(admins|participants)$/)){
			return "Type of inivtation required";
		}
	},
	
	parse: function (response){
		return response;
	}
	
});
