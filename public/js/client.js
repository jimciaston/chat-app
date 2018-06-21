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
let receive_ = document.querySelector(".receive_");
let newUser_text = document.querySelector(".welcome_box")
let user;

let welcome_header = document.querySelector("#welcome_header");



form.addEventListener("submit", function(e){
    e.preventDefault();
    user = input.value;
    //sets user name to input.value
    socket.emit('new user', input.value, function(data){
        if(data){
            userName_page.style.display = "none"
            chat_page.style.display = "flex";
            welcome_header.innerHTML = input.value + ' has joined the party';
            addAnimation();
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
        counter.innerHTML = (data.usersOnline.length + " Users are online");
        let user = data.user;
    });

});
//msg send
btn_send.addEventListener('click', function(){
    socket.emit('send msg', msg_input.value);

});


socket.on('send msg', function(data){
    if(data.user == user){

            msg_input.value = '';
            let p = document.createElement('p');
            receive_.append(p);
            p.innerHTML = data.msg;
            p.style.textAlign = 'right';
            p.style.backgroundColor = "red";
            p.style.justifyContent = "flex-end";
            p.style.paddingRight = "2em";
        }
        else{
            msg_input.value = '';
            let p = document.createElement('p');
            receive_.append(p);
            p.innerHTML = data.msg;
            p.style.textAlign = 'left';
            p.style.backgroundColor = "blue";
            p.style.paddingLeft = "2em";
        };
        //makes sure scroll stays at bottom
        receive_.scrollTop = receive_.scrollHeight;

    });
function addAnimation(){
    newUser_text.classList.add("act");
}




// TODO: everytime user gets into page, say pop up entered page
