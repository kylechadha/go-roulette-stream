$(document).ready(function() {
	navigator.getUserMedia  = navigator.getUserMedia ||
									navigator.webkitGetUserMedia ||
									navigator.mozGetUserMedia ||
									navigator.msGetUserMedia;

	var video = document.querySelector('video');

	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio: true, video: true}, function(stream) {
			console.log("stream");
			video.src = window.URL.createObjectURL(stream);

			video.onloadedmetadata = function(e) {
				console.log("onloadedmetadata");
				// Ready to go. Do some stuff.
			};
		}, function(e) {
			console.log('Reeeejected!', e);
		});
	} else {
		alert("Your browser does not support navigator.getUserMedia. No fun for you :(.")
	}


	// // If WebSockets are not available, no dice.
	// if (!window["WebSocket"]) {
	//     return;
	// }

	// // Declare variables.
	// var chat = $("#chat"),
	//     status = $("#status"),
	//     input = $("#input"),
	//     text = $("#text"),
	//     conn = new WebSocket('ws://' + window.location.host + '/ws');

	// // Set status messages.
	// conn.onopen = function(e) {
	//     status.text("Connected. All systems Go.");
	//     status[0].className = "alert alert-success";
	// };
	// conn.onclose = function(e) {
	//     status.text("Connection closed.")
	//     status[0].className = "alert alert-danger";
	// };

	// // Whenever we receive a message, update the chat window.
	// conn.onmessage = function(e) {
	//     if (e.data != chat.text()) {
	//         chat.text(chat.text() + "\n" + e.data);
	//     }
	// };

	// // Whenever chat input is submitted, send the data on the socket.
	// input.on('submit', function(e) {
	//     e.preventDefault();
	//     conn.send(text.val());
	//     text.val("");
	// })
})
