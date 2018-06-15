let socket = io();
let input = document.querySelector('#input_username');
let form = document.querySelector('form')

let userName_page = document.querySelector(".userName_page");
let chat_page = document.querySelector(".chat_page");
let chatWrapper = document.querySelector(".chat_wrapper")
let counter = document.getElementById("counter");
let users = document.querySelector(".users_online")

let msg_input = document.querySelector("#sendMsg");
let btn_send = document.querySelector("#send_btn");
let onlineUsers = [];
let sent_ = document.querySelector(".sent_");
let user;
form.addEventListener("submit", function(e){
    e.preventDefault();

    //sets user name to input.value
    socket.emit('new user', input.value, function(data){
        if(data){
            userName_page.style.display = "none"
            chat_page.style.display = "flex";
        }else{
            if(input.value == ''){
                input.classList.add("input_error");
                let error_msg = document.getElementById('error_input');
                error_msg.innerHTML = 'Please Type a UserName'
                error_msg.style.display = "block"
            }else{
                input.classList.add("input_error");
                let error_msg = document.getElementById('error_input');
                error_msg.style.display = "block";
                error_msg.innerHTML = "Woops, sorry but that user name is already taken, please try again";
            }

        }
    });
    socket.on('new user' , function (data){
        counter.innerHTML = (data.usersOnline.length);
        let user = data.user;
    });

});

socket.on('send msg', function(data){
    msg_input.value = '';
    let p = document.createElement('p');
    sent_.append(p);
    p.innerHTML = data.msg;
    console.log(user)

});
btn_send.addEventListener('click', function(){
    socket.emit('send msg', msg_input.value);
});





// TODO: check validation on forms
