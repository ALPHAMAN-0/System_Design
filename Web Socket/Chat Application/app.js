const { on } = require('cluster');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));

let socketConnected = new Set();
io.on('connection', onConnection);

function onConnection(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
         socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}