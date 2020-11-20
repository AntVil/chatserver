//TODO: send refresh requests every 10sec even when window closed (-> web worker)
let user;

let frame;

window.onload = function () {
    user = null;

    loginScreenElement = document.getElementById("login-screen");
    chatScreenElement = document.getElementById("chat-screen");
    usersElement = document.getElementById("users");
    messagesElement = document.getElementById("messages");
    chatBoxElement = document.getElementById("chat-box");
    chatAutoScrollCheckbox = document.getElementById("chat-autoScroll");
    backgroundElement = document.getElementById("background");
    aboutElement = document.getElementById("about");

    frame = 0;
    loop();
}

function loop() {

    //get chat every 120 frames = 2sec
    if (user !== null && frame % 120 === 0) {
        let messages = user.getMessages();
        //TODO: handle messages
        renderChat(messages);
        let userList = user.getUsers();
        //TODO: handle users
    }

    frame++;
    requestAnimationFrame(loop);
}
function renderUser(){

}
function renderChat(chat){

}
function scrollText() {
    /* Tried to make autoscroll only if there is no manual scrolling happening, no sucess yet.

    let lastScroll = 0;
    let down = false;
    chatBoxElement.on("scroll", function(e) {
        let scroll = this.scrollHeight;
        down = scroll > lastScroll;
        lastScroll = scroll;
    });
    */
    if (chatAutoScrollCheckbox.checked /*&& down*/ ) {
        chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    }
}

/* FUNCTIONS CALLED BY USER (BUTTON) */
function join() {
    let username = document.getElementById("username").value;
    user = new ChatUser("ws://localhost:2001/");

    loginScreenElement.style.display = "none";
    chatScreenElement.style.display = "flex";

    backgroundAnimation();
}

function sendMessage() {
    let message = document.getElementById("message").value;
    user.sendMessage(message);
}

function leave() {
    user.leave();
    loginScreenElement.style.display = "flex";
    chatScreenElement.style.display = "none";
}