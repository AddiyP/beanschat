const express = require('express');
const socketio = require('socket.io');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

let currentUsers = 0;

app.get('/', (req, res) => {
    res.render('index');
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("server is running");
});

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.on('connection', socket => {
    console.log('User connected');

    socket.username = "Anonymous";
    socket.isAuthenticated = false;

    currentUsers++;

    socket.on('change_username', data => {
        console.log("new username");
        socket.username = data.username;
        console.log(data);
    });

    socket.on('new_message', data => {
        console.log('new message');
        io.sockets.emit('receive_message', {message: data.message, username: socket.username});
    });
});
