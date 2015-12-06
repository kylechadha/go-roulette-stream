navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;


var SocketServer = function(url) {
	var conn = new WebSocket(url);
	var callbacks = {};

	this.bind = function(event_name, callback) {
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
		return this;
	};

	this.send = function(event_name, event_data) {
		var payload = JSON.stringify({
			event: event_name,
			data: event_data
		});
		conn.send(payload);
		return this;
	};

	conn.onmessage = function(evt) {
		var json = JSON.parse(evt.data)
		dispatch(json.event, json.data)
	};

	conn.onclose = function() {
		dispatch('close', null)
	}
	conn.onopen = function() {
		dispatch('open', null)
	}

	var dispatch = function(event_name, message) {
		var chain = callbacks[event_name];
		if (typeof chain == 'undefined') return; // no callbacks for this event
		for (var i = 0; i < chain.length; i++) {
			chain[i](message)
		}
	}
};

$(document).ready(function() {

	// If WebSockets are not available, no dice.
	if (!window["WebSocket"]) {
		return;
	}

	var goServer = new SocketServer('ws://' + window.location.host + '/ws');


	var $messages = $('#messages'),
		$modal = $('#name-prompt').modal({
			backdrop: 'static'
		}),
		currentUser;

	$modal.find('button').click(function(e) {
		e.preventDefault();
		name = $modal.find('input').val().trim();

		if (name === '') return;

		console.log("Kicking it all off.")
		$modal.modal('hide');

		initiate(name);
	});


	var mediaOptions = {
		audio: true,
		video: {
			mandatory: {
				minWidth: 1280,
				minHeight: 720
			}
		}
	};

	var initiate = function(name) {
		console.log("Initiate: starting webcam.")
		currentUser = {
			name: name,
			// id: guid(),
			// stream: undefined
		};

		navigator.getUserMedia(mediaOptions, connect, function(e) {
			console.error('Error using getUserMedia', e);
		});
	}

	var initiator = false;
	goServer.onmessage = function(m) {
		if (m.data === "initiator") {
			initiator = true;
		}
	};

	var connect = function(stream) {
		console.log("getUserMedia: got stream.")
		var video = $('#localVideo')[0];
		video.src = window.URL.createObjectURL(stream);

		var peer = new SimplePeer({
			initiator: initiator,
			stream: stream,
			trickle: false
		});

		peer.on('signal', function(data) {
			// when peer1 has signaling data, give it to peer2
			goServer.send(data)
		})
	}

	// var video = document.querySelector('video');

	// if (navigator.getUserMedia) {
	// 	// Note: Can set additional constraints here (video: {mandatory: { minWidth: 1280, minHeight: 720 }})
	// 	navigator.getUserMedia({
	// 		audio: true,
	// 		video: true
	// 	}, function(stream) {
	// 		console.log("stream");
	// 		video.src = window.URL.createObjectURL(stream);

	// 		console.log(window.URL.createObjectURL(stream));

	// 		video.onloadedmetadata = function(e) {
	// 			console.log("onloadedmetadata");
	// 			// Ready to go. Do some stuff.
	// 		};
	// 	}, function(e) {
	// 		console.error('Error using getUserMedia', e);
	// 	});
	// } else {
	// 	alert("Your browser does not support navigator.getUserMedia. No fun for you :(.")
	// }


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