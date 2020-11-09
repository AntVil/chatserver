let user;

let loginScreenElement;
let chatScreenElement;
let usersElement;
let messagesElement;
let chatBoxElement;
let chatAutoScrollCheckbox;
let backgroundElement; //background animation in chat-screen

let frame;

window.onload = function() {
    user = null;

    loginScreenElement = document.getElementById("login-screen");
    chatScreenElement = document.getElementById("chat-screen");
    usersElement = document.getElementById("users");
    messagesElement = document.getElementById("messages");
    chatBoxElement = document.getElementById("chat-box");
    chatAutoScrollCheckbox = document.getElementById("chat-autoScroll");
    backgroundElement = document.getElementById("background");

    frame = 0;
    loop();
}

async function loop() {

    //get chat every 60 frames = 1sec
    if (user !== null && frame % 60 === 0) {
        let chat = await user.getMessages();
        renderChat(chat);

        let userList = await user.getUsers();
        renderUsers(userList);
    }

    //scroll text all the time
    scrollText();

    frame++;
    requestAnimationFrame(loop);
}


function renderChat(chat) {
    let messages = chat.split("#");
    messagesElement.innerHTML = "";
    for (let i = 1; i < messages.length; i++) {
        let messageData = messages[i].split("|");
        let name = messageData[0];
        let time = messageData[1];
        let message = messageData[2];
        messagesElement.innerHTML += `
        <div class="chat-message">
            <div class="chat-metadata">
                <span class="chat-metadata-name">${name}</span>
                <span class="chat-metadata-time">${time}</span>
            </div>
            <br>
            <div class="chat-text">
                ${message}
            </div>
        </div>
        `;
    }
}

function renderUsers(userList) {
    let users = userList.split("#");
    usersElement.innerHTML = "";
    for (let i = 1; i < users.length; i++) {
        usersElement.innerHTML += users[i] + "<br>";
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
    user = new ChatUser(username);

    loginScreenElement.style.display = "none";
    chatScreenElement.style.display = "block";
}

function sendMessage() {
    let message = document.getElementById("message").value;
    user.sendMessage(message);
}

function leave() {
    user.leave();
    user = null;

    loginScreenElement.style.display = "block";
    chatScreenElement.style.display = "none";
}