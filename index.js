const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 9000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user joining
    socket.on('join', (username) => {
        // Broadcast to all connected clients that a new user has joined
        socket.broadcast.emit('user joined', username);
    });

    // Handle chat messages
    socket.on('chat message', (message) => {
        // Broadcast the message to all connected clients
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
