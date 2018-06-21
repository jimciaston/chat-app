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
var user;
app.use(express.static(publicPath));
let usersOnline = []; //keeps track of current users online

io.on('connection', (socket) => {
let user = socket.id;
socket.emit('user', user);

    socket.id = "anon";

    socket.on('new user', function(data,callback) {
        //if user name is taken
        if(usersOnline.indexOf(data) != -1 || data == ''){
            callback(false);
        }else{
            //if username is not taken
            callback(true);
            socket.id = data;
            //pushes data(username) to data
            usersOnline.push(socket.id);
            //sends back to client usersOnline array
            io.sockets.emit('new user', {usersOnline: usersOnline, user: socket.id});
            console.log(usersOnline.length)
        }
    });
    socket.on('disconnect', () => {
        usersOnline.splice(usersOnline.indexOf(socket.id), 1);
        //emits count users, sets current user
        io.sockets.emit('new user', {usersOnline: usersOnline, user: socket.id});
        console.log(usersOnline.length)

    });


    socket.on('send msg' , function(data){

        io.sockets.emit('send msg', {msg: data, user: socket.id});
    })

});

server.listen(port, () => {
    console.log('server is running master')
});
// TODO: Log socket.id to data;
