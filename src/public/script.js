let user;

let loginScreenElement;
let chatScreenElement;
let usersElement;
let messagesElement;
let chatBoxElemt;

let frame;

window.onload = function () {
    user = null;

    loginScreenElement = document.getElementById("login-screen");
    chatScreenElement = document.getElementById("chat-screen");
    usersElement = document.getElementById("users");
    messagesElement = document.getElementById("messages");
    chatBoxElemt = document.getElementById("chat-box");
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
if(document.getElementById('autoScroll').checked){
    chatBoxElemt.scrollTop = chatBoxElemt.scrollHeight;
}
}

function renderUsers(userList) {
    let users = userList.split("#");
    usersElement.innerHTML = "";
    for (let i = 1; i < users.length; i++) {
        usersElement.innerHTML += users[i] + "<br>";
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