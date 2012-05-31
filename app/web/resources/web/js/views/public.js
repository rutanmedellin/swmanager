/*
 * Home page
 */

App.Views.Home = Backbone.View.extend({
	tagName: "DIV",
	className: "container",
	initialize: function (){
		_.bindAll(this, 'render');
		this.render();		
	},
	
	events: {
		
	},
	
	render: function (){
		var view = this;
		$(this.el).html(JST.index({model: this.model}));
		
		$(".tweets", this.el).tweet({
			join_text: "auto",
			username: this.model.get("twitter"),
			avatar_size: 48,
			count: 5,
			auto_join_text_default: "we said,",
			auto_join_text_ed: "we",
			auto_join_text_ing: "we were",
			auto_join_text_reply: "we replied",
			auto_join_text_url: "we were checking out",
			loading_text: "loading tweets..."
       });
	   
	   /*
	    * Event Countdown
	    */
	   if (!this.model.isNew()) {
		   	var start_date = this.parseDate(this.model.get("start_date"));
		   	var end_date = this.parseDate(this.model.get("end_date"));
			
			count_down = this.setCountDown(start_date, end_date);			
			if (count_down.date) {
				var d, h, m, s;				
				$('div#clock').countdown(new Date(count_down.date.year, count_down.date.month - 1, count_down.date.day, count_down.date.hours, count_down.date.minutes), function(event){
				//var now = new Date()
				//now.setMinutes(now.getMinutes() +  400);
				//$('div#clock').countdown(now, function(event){
				
					var timeFormat = "%d day(s) %h:%m:%s"
					$this = $(this);
					switch (event.type) {
						case "days":
							d = event.value;
							break;
						case "hours":
							h = event.value;
							break;
						case "minutes":
							m = event.value;
							break;
						case "seconds":
							s = event.value;
							break;
						case "finished":
							$this.fadeTo('slow', 0.5);
							break;
					}
					// Assemble time format
					if (d > 0) {
						timeFormat = timeFormat.replace(/\%d/, d);
						timeFormat = timeFormat.replace(/\(s\)/, Number(d) == 1 ? '' : 's');
					}
					else {
						timeFormat = timeFormat.replace(/%d day\(s\)/, '');
					}
					timeFormat = timeFormat.replace(/\%h/, h);
					timeFormat = timeFormat.replace(/\%m/, m);
					timeFormat = timeFormat.replace(/\%s/, s);
					// Display
					$this.html(timeFormat);
					$this.prepend(count_down.message);
				});
			}else{
				$('div#clock').html(count_down.message);
			}			
		}
	},
	
	setCountDown: function (start_date, end_date){
		var now = new Date();		
		var dates = [start_date, end_date];
		var start_date_ob = new Date(start_date.year, start_date.month -1, start_date.day, start_date.hours, start_date.minutes);
		var end_date_ob = new Date(end_date.year, end_date.month -1, end_date.day, end_date.hours, end_date.minutes);
		var pitch_time = new Date(end_date.year, end_date.month -1, end_date.day, end_date.hours, end_date.minutes);
		pitch_time = pitch_time.setMinutes(pitch_time.getMinutes() +  90);
		
		if (now < start_date_ob){
			return {
				date: start_date,
				message: "Starting in "
			};
		}else if ( now > start_date_ob && now < end_date_ob) {
			return {
				date: end_date,
				message: "Pitches in "
			}
		}else if ( now > end_date_ob && now < pitch_time){
			if (this.model.get('streaming-url') == "" || this.model.get('streaming-url') == undefined){
				return {
					date: false,
					message: "Ssssh! Pitches running right now!!" 
				}		
			}else{
				return {
					date: false,
					message: "Ssssh! Pitches running right now!! <a href='" + this.model.get('streaming-url') + "'>Watch the Streaming</a>" 
				}
			}
			
		}else{
			return {
				date: false,
				message: "The event was the " + start_date.day + " - " + end_date.day + "/" + start_date.month + "/" + start_date.year 
			}
		}	
		
	},
	
	parseDate: function (djson){
		date = djson.split('T')[0];
		date = date.split("-");
		time = djson.split('T')[1];
		time = time.split('Z')[0];		
		time = time.split(':');		
		var formated_date = {
			year: date[0],
			month: date[1],
			day: date[2],
			hours: time[0],
			minutes: time[1],
		};
		return formated_date;
	}
	
});

/*
 * Public projects
 */

App.Views.PublicProjects = Backbone.View.extend({
	tagName: "div",
	className: "container",
	initialize: function (){
		_.bindAll(this, 'render');
		this.render();		
	},
	
	events: {
		
	},
	
	render: function (){
		var view = this;
		$(this.el).html(JST.public_list());
		
		Data.Collections.projects = new App.Collections.Projects();
		Data.Collections.projects.fetch(
			{
				success: function (collection, response){
					/*
					 * the App.Views.Projects is taken from the admin view
					 */
					view.projects = new App.Views.Projects({el: "#list", collection: collection});
					FB.XFBML.parse();
				},
				error: function (collection, response){
					
				}
			}
		);	

	},
	
});

/*
 * Public Participants
 */

App.Views.PublicParticipants = Backbone.View.extend({
	tagName: "div",
	className: "container",
	initialize: function (){
		_.bindAll(this, 'render');
		this.render();		
	},
	
	events: {
		
	},
	
	render: function (){
		var view = this;
		$(this.el).html(JST.public_list());
		
		Data.Collections.participants = new App.Collections.Users();
		Data.Collections.participants.fetch(
			{				
				data: {
					role: "participants"
				},
				success: function (collection, response){
					participants = new App.Views.AdminUsersList({el: "#list", collection: collection, role: "participants"});
				},
				error: function (collection, response){
					
				}
			}
		);	

	},
	
});
 