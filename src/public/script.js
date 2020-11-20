//TODO: send refresh requests every 10sec even when window closed (-> web worker)
let user;

let loginScreenElement;
let chatScreenElement;
let usersElement;
let messagesElement;
let chatBoxElement;
let chatAutoScrollCheckbox;
let backgroundElement; //background animation in chat-screen

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
        let messages = user.getNewMessages();
        //TODO: handle messages
        renderChat(messages);
        //let userList = user.getUsers();
        //TODO: handle users
    }
    scrollText();
    frame++;
    requestAnimationFrame(loop);
}
function renderUser(){

}
function renderChat(messages){
    for (let i = 0; i < messages.length; i++) {
        let name = messages[i].user;
        let time = messages[i].time;
        let message = messages[i].data;

        let messageElement = document.createElement("div");
        let metaElement = document.createElement("div");
        let metaNameElement = document.createElement("span");
        let metaTimeElement = document.createElement("span");
        let textElement = document.createElement("div");

        messageElement.classList.add('chat-message');
        metaElement.classList.add('chat-metadata');
        metaNameElement.classList.add('chat-metadata-name');
        metaTimeElement.classList.add('chat-metadata-time');
        textElement.classList.add('chat-text');

        messageElement.append(metaElement, textElement);
        metaElement.append(metaNameElement, metaTimeElement);

        metaNameElement.innerHTML = name;
        metaTimeElement.innerHTML = time;
        textElement.innerHTML = message;

        messagesElement.appendChild(messageElement);
    }
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
    user = new ChatUser(username, "ws://localhost:2001/");

    loginScreenElement.style.display = "none";
    chatScreenElement.style.display = "flex";

    //backgroundAnimation();
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