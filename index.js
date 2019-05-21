var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("app listening on port " + PORT);
});

app.use('/', express.static(__dirname + '/app'));

app.use(bodyParser.json({
    extended: true
}));

var  users = {};

app.get('/getPort', (req, res) => {
    
    res.status(200).json({port: PORT});
  });

io.on('connection', function (socket) {

    users[socket.id] = socket.handshake.query.name;

    io.sockets.emit('user_connected', { name: users[socket.id] });

    socket.on('send_message', function(data) {
		io.sockets.emit('new_message', { text: data.text, name: users[socket.id] });
    });
    
    socket.on('disconnect', function(data) {
        io.sockets.emit('user_disconnected', { name: users[socket.id] });
        delete users[socket.id];
	});
});



