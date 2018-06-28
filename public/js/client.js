let socket = io();
let input = document.querySelector('#input_username');
let form = document.querySelector('form')

let userName_page = document.querySelector(".userName_page");
let chat_page = document.querySelector(".chat_page");
let chatWrapper = document.querySelector(".chat_wrapper")
let counter = document.getElementById("counter");
let users = document.querySelector(".users_online")
let join_btn = document.querySelector(".button-effect")
let msg_input = document.querySelector("#sendMsg");
let btn_send = document.querySelector("#send_btn");
let onlineUsers = [];
let sent_ = document.querySelector(".sent_");
let receive_ = document.querySelector(".receive_");
let newUser_text = document.querySelector(".welcome_box")
let user;
let isTyping = document.querySelector('#isTyping')
let welcome_header = document.querySelector("#welcome_header");
let USER_COLOR = null; //set for null, use later
let users_online_container = document.querySelector(".users_online");

join_btn.addEventListener("click", function(e) {
    e.preventDefault();
    user = input.value;
    //sets user name to input.value
    socket.emit('new user', input.value, function(data) {
        if (data) {
            //ALL data has been completed, sends user to chat
            userName_page.style.display = "none"
            chat_page.style.display = "flex";
            welcome_header.innerHTML = input.value + ' has joined the party';
            addAnimation();
            welcome_header.style.display == 'none'
            //assign random color to each user on receiving end

            let colorArr = ['#F660AB','#65ff96', '#bda772','#c98496', '#ff4139', '#a7ffee', '#ff9464','#8bffb3s','#536DAD'];
                for(let i = 0; i < colorArr.length; i++){
                    let randomColor = parseInt(Math.random() * colorArr.length);
                    USER_COLOR = colorArr[randomColor];
                }

        } else {
            //sets errors if username doesn't match
            if (input.value == '') {
                input.classList.add("input_error");
                let error_msg = document.getElementById('error_input');
                error_msg.innerHTML = '* Invalid, Please Type a Username'
                error_msg.style.display = "block";
                input.style.border = "3px solid #d9534f";

            } else {
                input.classList.add("input_error");
                let error_msg = document.getElementById('error_input');
                error_msg.style.display = "block";
                error_msg.style.border = "3px solid	#d9534f"
                error_msg.innerHTML = "* Woops, sorry but that user name is already taken, please try again";
            }

        }
    });

    //sets up new user list
    let ul = document.querySelector('#users_list');
    //new user is connected, main user tracker
    socket.on('USERS_CONNECTED', function(data) {
        if(data.usersOnline.length == 1){
            counter.innerHTML = "Looks Like You're all Alone";
        }
        else{
            //counts online users currently
            counter.innerHTML = "Party Rockers Online";
        }
    //sets array to match total users online sent from server
        let arr = data.usersOnline;
        let ul = document.querySelector('#users_list'); //grabs list
            for (let i = 0; i < arr.length; i++) {
                let h = document.createElement('li');
                h.setAttribute('id', 'user-' + data.user); //sets id
                h.innerHTML = arr; //li will equal arr

            }

        });

    });

//checks if enter is pressed, if so emits message to chat
function search(ele) {
    if (event.key === 'Enter') {
        if(msg_input.value == ''){
            msg_input.style.border = "2px solid red";
            let error_msg = document.getElementById('error_msg');
            error_msg.style.display = "block";
            error_msg.innerHTML = "* Message Field Can't be Left Blank";
        }else{
            error_msg.innerHTML = '';
            socket.emit('send msg', msg_input.value);
        }
    }
}
//send message events

socket.on('send msg', function(data) {
    if (data.user == user) {
            //sender logic
            msg_input.value = '';
            let p = document.createElement('p');
            receive_.append(p);
            p.innerHTML = "<span class = 'user_msg_box'>" + 'You' + "</span>" + ": " + data.msg;

            //paragraph stylings for sender
            p.style.width = "auto";
            p.style.maxWidth = "550px";
            p.style.float = "right";
            p.style.borderRadius = "10px";
            p.style.padding = "5px 15px";
            p.style.backgroundColor = '#00FF00';
            p.style.justifyContent = "flex-end";
            p.style.paddingRight = "1em";
            p.style.marginRight = "1rem";
    } else {

        //receiver logic
        msg_input.value = '';
        let p = document.createElement('p');
        receive_.append(p);
        p.innerHTML = "<span class = 'user_msg_box'>" + data.user + "</span>" + ": " + data.msg;
        //paragraph stylings for receiver
        p.style.textAlign = 'left';
        p.style.backgroundColor = USER_COLOR;
        p.style.paddingLeft = "2em";
        p.style.transition = '1s ease-in';
        p.style.width = "auto";
        p.style.maxWidth = "550px";
        p.style.float = "left";
        p.style.borderRadius = "10px";
        p.style.padding = "5px 15px";
        p.style.justifyContent = "flex-end";
        p.style.paddingRight = "2em";
        p.style.marginLeft = "1rem";
    };

    //makes sure scroll stays at bottom
    receive_.scrollTop = receive_.scrollHeight;
});

//msg send button

btn_send.addEventListener('click', function() {
    if(msg_input.value == ''){
        msg_input.style.border = "2px solid red";
        let error_msg = document.getElementById('error_msg');
        error_msg.style.display = "block";
        error_msg.innerHTML = "* Message Field Can't be Left Blank";
    }else{
        error_msg.innerHTML = '';
        socket.emit('send msg', msg_input.value);
    }

});
//adds animation class to when new user enters chat
function addAnimation() {
    newUser_text.classList.add("act");
}

//When user logs in, sets li to current users in Chat
socket.on('firstLogin', function(data) {
    let ul = document.querySelector('#users_list');
    ul.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            addUserToList(ul, data[i]);
        }
});

//add connected user to li
socket.on('addConnectedUser', function(data) {
    let ul = document.querySelector('#users_list');
    addUserToList(ul, data);

});
//function that creates li, and sets id to match user username
function addUserToList(ul, userName) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(userName));
    li.setAttribute('id', 'user-' + userName);
    ul.appendChild(li);
}

//Deletes User from HTML li
socket.on('USERS_dis', function(data) {
    var user = document.getElementById('user-' + data.user);
    user.parentNode.removeChild(user);
});


// TODO: language prohibitor
// TODO: disable msg if field is empty
// TODO: allow picture upload
