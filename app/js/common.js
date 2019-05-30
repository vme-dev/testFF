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

		socket = io.connect(window.location.host,{
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

(function () {
	var $toolbarGroup = $(".toolbar-item");
	var $headContent = $(".head-content");

	var size = $headContent.length;
	var counter = 0;
	var index = 0;

	function timer () {
		if( counter == (size -1) ) { 
			$(".head-content")
				.eq( counter )
				.toggleClass("center-to-left active")
				.end()
				.eq( 0 )
				.toggleClass("right-to-center active");
			counter = 0;
			changeToolbar(counter)
		 } else {
			toLeft(); 
		 }
	}

	var timerId = setInterval( timer , 5000);

	$(".head-content").on("animationend", function () {
		$(this).removeClass("center-to-right center-to-left right-to-center left-to-center");
	})

	$toolbarGroup.on('click', function (e) {
		changeToolbar( $(this).index() );
		console.log(counter == index);
		if ( counter == index) { return 0 };
		clearInterval(timerId);

		if (counter < index) {
			$(".head-content").eq( counter ).toggleClass("center-to-left active").end().eq(index).toggleClass("right-to-center active");
			counter = index;
		} else {
			$(".head-content").eq( counter ).toggleClass("center-to-right active").end().eq(index).toggleClass("left-to-center active");
			counter = index;
		}

		timerId = setInterval( timer , 5000);
	});

	function changeToolbar (i) {
		index = i;
		$toolbarGroup.removeClass("active").eq(i).addClass("active");
	};

	function toRight() {
		$(".head-content").eq( counter ).toggleClass("center-to-right active").prev().toggleClass("left-to-center active");
		counter--;
		changeToolbar(counter);
	};

	function toLeft() {
		
		$(".head-content").eq( counter ).toggleClass("center-to-left active").next().toggleClass("right-to-center active");
		counter++;
		changeToolbar(counter);
	};

})();

(function () {
	var menu = $(".head-nav .head-list");
	var menuItem = $(".head-nav .head-item");


	$(".head-nav .nav-button").click(function () {
		menu.toggleClass("active");
	});

	menuItem.click(function (e) {
		var i = $(this).index();
		menuItem.removeClass("active").eq(i).addClass("active");

		if (i == 2) {
			i = i + 1;
		}
		
		$([document.documentElement, document.body]).animate({
			scrollTop: $(".section").eq(i).offset().top
		}, 2000);
		menu.removeClass("active");
	})
})();
