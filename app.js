var express = require('express');
var app = express();
var http = require("http");
var port = 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var userinfoTotal = {};
var messages = [];
var sockets = [];
var Game = require("./game.js");
var waitingPlayer = null;
var server = require('http').createServer(app);
var path = require("path");
//connect to MongoDB
mongoose.connect('mongodb://appUser:password33!@ds119446.mlab.com:19446/connect4');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/html'));


// include routes
var routes = require('./routes/router.js');
app.use('/', routes);

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/media", express.static(__dirname + '/media'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


//var io = require('socket.io')(server);

var Player = function(client) {
    this.client = client;
};

//when a player connects
// io.sockets.on('connection', function(socket) {
//     var player = new Player(socket);

//     //sends a new move to the other player
//     var sendMove = function(col) {
//         console.log("send move ", col);
//         player.game.currentPlayer.client.json.send({ move: col });
//     };

//     //in case of win, sends message to each player with the adequate message
//     var sendWin = function(winner) {
//         var firstPlayerResult,
//             secondPlayerResult;

//         if (winner == 0) {
//             firstPlayerResult = secondPlayerResult = 'tie';
//         } else {
//             var firstPlayerIsWinner = (winner == firstPlayer);
//             firstPlayerResult = (firstPlayerIsWinner) ? "win" : "lost";
//             secondPlayerResult = (firstPlayerIsWinner) ? "lost" : "win";
//         }

//         firstPlayer.client.json.send({ win: firstPlayerResult });
//         secondPlayer.client.json.send({ win: secondPlayerResult });
//     }


//     //the case when the first player is connected, and waits for the second
//     if (waitingPlayer == null) {
//         waitingPlayer = player;
//     }
//     //the second player connects,
//     //waitingPlayer becomes null, so another first player can start another game
//     else {
//         var secondPlayer = player;
//         var firstPlayer = waitingPlayer;
//         waitingPlayer = null;

//         //sending order of turns to connected users
//         firstPlayer.client.json.send({ turn: 1 });
//         secondPlayer.client.json.send({ turn: 2 });

//         //creating a new game, and passing created palyers and functions
//         var game = new Game();
//         game.create(firstPlayer, secondPlayer, sendMove, sendWin);

//         //sending each player information about the game
//         firstPlayer.game = game;
//         secondPlayer.game = game;
//     }
//     //socket waits for the message 'submit-move' to process the sent move
//     socket.on('submit-move', function(data) {
//         console.log('submit-move: ', data);
//         player.game.onMove(data.move);
//     });

// });
// //messages
// io.sockets.on('connection', function(socket) {

//     sockets.push(socket);

//     socket.emit('messages-available', messages);

//     socket.on('add-message', function(data) {
//         messages.push(data);
//         sockets.forEach(function(socket) {
//             socket.emit('message-added', data);
//         });
//     });
// });

// listen on port 3000
app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});