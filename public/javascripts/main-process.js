function sendRequest() {
	$('#select_form').submit();
}

$(document).ready(function() {
	console.log("in Main-process.js");
});

$(document).on('scroll', function() {
	console.log("On Scroll Event");
});



