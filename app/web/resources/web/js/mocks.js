var ajax = $.ajax;
var response;
$.ajax = function ajaxMock(params) {
	log('Mock Request\ntype: ' + params.type + '\nurl: ' + params.url);
	
	var data = {
		"messages": [{
		  "type": "error",
		  "message": "No mock defined for request"
		}]
	};
	
	if(params.type == 'POST' || params.type == 'post'){
		if (params.url.match('.*sessions$') != null) {
			var d = $.parseJSON(params.data);
			
			data = {'id': 1,
					'username': d.username,
					'token': "12345",
					};
			response = data;
			account_data = {
				user: data
			};
		}
		else if (params.url.match('.*users/self/changepassword$') != null) {
	  		data = {
		      "messages": {
			  		"type": "info",
			  		"message": "Your password has been changed."
		    	}
	  		};
	  	}
	}
	params.success(data);
};
  
