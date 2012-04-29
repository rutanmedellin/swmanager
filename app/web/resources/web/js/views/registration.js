App.Views.UserRegistration = Backbone.View.extend({
	
	tagName: "div",
	className: "",
	
	initialize: function (){
		_.bindAll(this, "render", "signup");
		this.render();
	},
	
	events: {
		"click .signup": "signup",
	},
	
	render: function (){
		var code = this.options.code;
		var email = this.options.email;
		this.model = new App.Models.User({
			code: code,
			email: email,	
		});
		$(this.el).html(JST.user_registration({model: this.model}));
	},
	
	signup: function(e){
		try{
			e.preventDefault();	
		}catch(e){
			
		}		
		cleaned_data = this.validate();
		if(cleaned_data){			
			this.model.save(cleaned_data, {
				success: function (model, response){
					Set_Cookie('Token', response.key, 1, '/', host);
					Set_Cookie('username', response.username, 1, '/', host);
					Set_Cookie('userID', response.id, 1, '/', host);
					//location.search = "";
					location = "/";					
				},
				error: function (model, response){
					if (response.status != 200){
						$("#registration-code-error").modal("show");
					}	
				}
			});
		}		
	},
	
	validate: function (){
		var email = $("input[name=email]", this.el).val();
		var code = $("input[name=code]", this.el).val();
		var password = $("input[name=password]", this.el).val();
		var repassword = $("input[name=repassword]", this.el).val();
		
		errors = 0;
		if(code == ""){
			errors += 1;
		}
		if(email == "" || !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)){
			errors += 1;
			$(".help-inline", "#email-ctrl").removeClass("hide");
			$("#email-ctrl").addClass("error");
		}else{
			$(".help-inline", "#email-ctrl").addClass("hide");
			$("#email-ctrl").removeClass("error");
		}
		if (password == ""){
			errors += 1;
			$(".help-inline", "#password-ctrl").removeClass("hide");
			$("#password-ctrl").addClass("error");
		}else{
			$(".help-inline", "#password-ctrl").addClass("hide");
			$("#password-ctrl").removeClass("error");
		}
		if (password != repassword){
			errors += 1;
			$(".help-inline", "#repassword-ctrl").removeClass("hide");
			$("#repassword-ctrl").addClass("error");
		}else{
			$(".help-inline", "#repassword-ctrl").addClass("hide");
			$("#repassword-ctrl").removeClass("error");
		}
		
		if(errors){
			return false;
		}
		return {
			email: email,
			code: code,
			password: password,
			repassword: repassword
		};
	}
	
});
