let socket = io();
let input = document.querySelector('#input_username');
let form = document.querySelector('form')

let userName_page = document.querySelector(".userName_page");
let chat_page = document.querySelector(".chat_page");


form.addEventListener("submit", function(e){
    e.preventDefault();
    (function checkInput(){
        if(input.value == ''){
            input.classList.add("input_error");
            let error_msg = document.getElementById('blank_input');
            error_msg.style.display = "block"
        }

        socket.on('count users', function(user){
            let counter = document.getElementById("counter");
            counter.innerHTML = user.current.length + ' users online';
            if(input.value.indexOf(user.current) != -1){
                console.log(input.value + ' is present');

            }
        });

    })();

    //sets user name to input.value
    socket.emit('new user', {
        user: input.value
    });

    if(input.value !== '' ){
        userName_page.style.display = "none";
        chat_page.style.display = "block";
    }


});




// TODO: check validation on forms
