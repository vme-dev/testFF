$(function() {

	var $nameForm = $("#name-chat-form");
	var $chatName = $("#chat-name");
	var $chat = $("#chat");
	var $chatForm = $("#chat-form");
	var $chatMessage = $("#chat-message");
	var $messageField = $("#message-field");
	var $closeChat = $("#close-chat");
	var $openChat = $("#open-chat");
	var $chatBlock = $("#chat-block");

	var socket;

	function message (data) {
		var str = '<div class="message"><span class="name">'+data.name+': </span><span class="text">'+data.text+'</span></div>';
		return str
	};
	function userConnected (user) {
		var str = '<div class="user-connected">New user: '+user+'</div>';
		return str
	};
	function userDisconnected (user) {
		var str = '<div class="user-disconnected">'+user+' left chat.</div>';
		return str
	};

	$nameForm.submit(function(event) {
		event.preventDefault();

		var name = $chatName.val();
		if (!name) {
			return 0;
		}

		fetch('/getPort')
            .then(function(res){
				if (!res.ok) {
                    throw Error(res.statusText);
                }
				return res;
			})
            .then(function (res){
				return res.json()
			})
            .then(function(json){
				
				socket = io.connect('http://localhost:'+json.port,{
					query: {
						name: name
					}
				});
		
				socket.on('new_message', function (data) {
					$messageField.append(message(data));
					$messageField.scrollTop($messageField.height());
				});
			
				socket.on('user_connected', function (user) {
					$messageField.append(userConnected(user.name));
					$messageField.scrollTop($messageField.height());
				});
		
				socket.on('user_disconnected', function (user) {
					$messageField.append(userDisconnected(user.name));
					$messageField.scrollTop($messageField.height());
				});

				$chatName.val('');
				$nameForm.hide();
				$chat.show();

			})
			.catch( function(err){
				alert("Server error");
				console.error(err);
			});
	});

	$chatForm.submit(function(event) {
		event.preventDefault();
		
		var text = $chatMessage.val();
		if (!text) {
			return 0;
		}
		socket.emit('send_message', { text: text });

		$chatMessage.val('');
	});

	$closeChat.click(function(event) {
		event.preventDefault();
		$chatBlock.hide();
	});

	$openChat.click(function(event) {
		event.preventDefault();
		$chatBlock.show();
	});

});

