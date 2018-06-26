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

let users_online_container = document.querySelector(".users_online");


join_btn.addEventListener("click", function(e){
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
                error_msg.innerHTML = '*Invalid, Please Type a Username'
                error_msg.style.display = "block";
                input.style.border = "2px solid #d9534f";

            }else{
                input.classList.add("input_error");
                let error_msg = document.getElementById('error_input');
                error_msg.style.display = "block";
                error_msg.style.border = "2px solid	#d9534f"
                error_msg.innerHTML = "Woops, sorry but that user name is already taken, please try again";
            }

        }
    });

    //sets up new user
let ul = document.querySelector('#users_list');
    socket.on('USERS_CONNECTED' , function (data){


        //counts online users currently
        counter.innerHTML = (data.usersOnline.length + " Online");
        let arr = data.usersOnline;
        let ul = document.querySelector('#users_list');
        for(let i = 0; i < arr.length; i++){


                let h = document.createElement('li');
                 h.setAttribute('id','user-' + data.user);
                    h.innerHTML = arr;


        }

    });


});
socket.on('USERS_dis', function(data){
    counter.innerHTML = (data.usersOnline.length + " Users Online");


            var user = document.getElementById('user-' + data.user);
            user.parentNode.removeChild(user);

})


//msg send

btn_send.addEventListener('click', function(){
    socket.emit('send msg', msg_input.value);

});
//checks if enter is pressed, if so emits message to chat
function search(ele) {
    if(event.key === 'Enter') {
        socket.emit('send msg', msg_input.value);
    }
}
//send message events

socket.on('send msg', function(data){
    if(data.user == user){
        //sender logic
            msg_input.value = '';
            let p = document.createElement('p');
            receive_.append(p);
            p.innerHTML = "<span class = 'er'>" + 'You' + "</span>" + ": " + data.msg;
            p.style.textAlign = 'right';
            p.style.backgroundColor = "#5cb85c";
            p.style.justifyContent = "flex-end";
            p.style.paddingRight = "2em";
        }
        else{
            //receiver logic
            msg_input.value = '';
            let p = document.createElement('p');
            receive_.append(p);
            p.innerHTML = "<span class = 'er'>" + data.user + "</span>" + ": " + data.msg;
            p.style.textAlign = 'left';
            p.style.backgroundColor = "#5bc0de";
            p.style.paddingLeft = "2em";
        };

        //makes sure scroll stays at bottom
        receive_.scrollTop = receive_.scrollHeight;
    });
function addAnimation(){
    newUser_text.classList.add("act");
}







socket.on('firstLogin', function(data){
    let ul = document.querySelector('#users_list');
ul.innerHTML = '';
for(let i = 0; i < data.length; i++){
    addUserToList(ul, data[i]);
}

});

socket.on('addConnectedUser', function(data) {
                let ul = document.querySelector('#users_list');
				addUserToList(ul, data);
	});


function addUserToList(ul, userName) {

        let li = document.createElement('li');
          li.appendChild(document.createTextNode(userName));
           li.setAttribute('id','user-' + userName);
            ul.appendChild(li);

    }
    socket.on('logout', function(data) {

			var user = document.getElementById('user-' + data);
			user.parentNode.removeChild(user);
	});



// TODO: everytime user gets into page, say pop up entered page
