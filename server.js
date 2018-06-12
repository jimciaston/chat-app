const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 3001;
let app = express();
let server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
let usersOnline = []; //keeps track of current users online
io.on('connection', (socket) => {

    socket.id = "anon";

    socket.on('new user', function(data) {
        socket.id = data.user;
        //pushes users to array
        if(usersOnline.indexOf(socket.id) === -1){
            usersOnline.push(socket.id);
            io.sockets.emit('count users', {current: usersOnline});
            console.log('now ther are ' + usersOnline.length + ' online')
        }else{
            console.log('please pick another name')
        }
        //emits new event, keep track of current users online


    });
    socket.on('disconnect', () => {
        usersOnline.splice(usersOnline.indexOf(socket.id), 1);
        //emits count users, sets current user
        io.sockets.emit('count users', {current: usersOnline});

    })

});

server.listen(port, () => {
    console.log('server is running master')
});

// TODO: update clientside when user disocnnects
