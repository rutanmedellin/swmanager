App.Models.Idea = App.Models.BaseModel.extend({
    url: function(){
        var base = "/api/v1/ideas/"
        if (this.isNew()) 
            return base;
        return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id + "/";
    },
    
    parse: function(response){
        return response;
    },
    
    validate: function(attrs){
        var errors = {};
        var errors_count = 0;
        if (attrs.name == undefined || attrs.name == "") {
            errors.name = "Name required";
            errors_count += 1;
        }
        if (attrs.participant == undefined || attrs.participant.id == "") {
            errors.participant = "Participant required";
            errors_count += 1;
        }
        if (attrs.description == undefined || attrs.description == "") {
            errors.description = "Description required";
            errors_count += 1;
        }
        if (errors_count) {
            return errors;
        }
    },
    
    validateVoting: function(){
        var user = Data.Models.account;
		this.alreadyVote = false;
		for (var i = 0; i < user.get('votes').length; i++) {
            if (this.url() == user.get('votes')[i].type_id) {
				this.user_vote = new App.Models.Vote(user.get('votes')[i]);
				this.user_vote.id = user.get('votes')[i].id;
                this.alreadyVote = true;
            }
        }
        if (user.get('votes').length < 3) {
            this.canVote = true;
        }else{
			this.canVote = false;
		}
    },

	removeVote: function (){
		for (var i = 0; i < Data.Models.account.get('votes').length; i++){
			if (this.user_vote.id == Data.Models.account.get('votes')[i].id){
				Data.Models.account.get('votes').splice(i, 1)
				this.user_vote = undefined;
				return;				
			}
		}
	},
	
	addVote: function (vote){
		Data.Models.account.get('votes').push(vote.toJSON());
	}

});
