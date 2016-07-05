$.fn.editable.defaults.mode = 'inline';

$(window).load(function() {
  init();
})

function init() {
	$.get('/users/56c91e75a986a9d2ce8cc456', function(user) {
  	$('#name').text(user.name);
  	$('#email').text(user.email);
  	$('#github').text(user.github);
  	user.portfolio.skills.forEach(function(skill) {
    	$('#skills').append($('<li>').html(
      	'<a href="#" class="editable-value" data-type="text" data-pk="' + skill._id + '" data-url="/users/56c91e75a986a9d2ce8cc456/portfolio/skills">' +
      	skill.name +
      	'</a>'
    	));
  	});
  	$('#skills .editable-value').editable({
    	showbuttons: false,
    	params: function(params) { return JSON.stringify(params); },
    	onblur: 'submit',
    	ajaxOptions: {
      	type: 'put',
      	dataType: 'json',
      	contentType: 'application/json; charset=utf-8'
    	}
  	});
  	$('.editable-value.new-value').editable({
    		value: '',
    		showbuttons: false,
    		params: function(params) { return JSON.stringify(params); },
    		onblur: 'submit',
    		//url: '/users/56c91e75a986a9d2ce8cc456',
    		ajaxOptions: {
    			type: 'post',
    			dataType: 'json',
    			contentType: 'application/json; charset=utf-8'
    		},
    		success: function(response, newValue) {
    			//$(this).prev('ul').append($('<li>').text(newValue.name));
    			//$(this).editable('toggle');
    			location.reload();
    		}
    	});
  	$('#profileForm .editable-value').editable({
    	showbuttons: false,
  		params: function(params) { return JSON.stringify(params); },
  		onblur: 'submit',
  		//url: '/users/56c91e75a986a9d2ce8cc456',
  		ajaxOptions: {
  			type: 'put',
  			dataType: 'json',
  			contentType: 'application/json; charset=utf-8'
  		},
  		success: function(response, newValue) {
  			//location.reload();
  		},
  		error: function(a, b) {
  			console.error(a, b);
  		}
  	});
	});
}