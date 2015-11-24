navigator.getUserMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

$(document).ready(function() {

	var mediaOptions = {
		audio: true,
		video: {
			mandatory: {
				minWidth: 1280,
				minHeight: 720
			}
		}
	};

	var $messages = $('#messages'),
			$modal = $('#name-prompt').modal({ backdrop: 'static' })

	$modal.find('button').click(function(e) {
		e.preventDefault();
		name = $modal.find('input').val().trim();
		if (name === '') return;
		
		console.log("Kicking it all off.")
		$modal.modal('hide');
	});

	var video = document.querySelector('video');

	if (navigator.getUserMedia) {
		// Note: Can set additional constraints here (video: {mandatory: { minWidth: 1280, minHeight: 720 }})
		navigator.getUserMedia({audio: true, video: true}, function(stream) {
			console.log("stream");
			video.src = window.URL.createObjectURL(stream);

			console.log(window.URL.createObjectURL(stream));

			video.onloadedmetadata = function(e) {
				console.log("onloadedmetadata");
				// Ready to go. Do some stuff.
			};
		}, function(e) {
			console.error('Error using getUserMedia', e);
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
