const OWN_MESSAGE_STYLE = "message-own";
const OUTSIDER_MESSAGE_STYLE = "message-other";
const SERVER_MESSAGE_STYLE = "message-server";

function renderUsers(userList) {
    userlistContainer.innerHTML = "";
    for (let i = 0; i < userList.length; i++) {
        let user = document.createElement("div");
        user.innerHTML = userList[i];
        userlistContainer.appendChild(user);
    }
}

function renderChat(messages) {
    for (let i = 0; i < messages.length; i++) {
        let name = messages[i].user;
        let time = messages[i].time;
        let message = messages[i].data;

        let messageContainer = document.createElement("div");
        let metaContainer = document.createElement("div");
        let metaNameContainer = document.createElement("p");
        let metaTimeContainer = document.createElement("p");
        let textContainer = document.createElement("p");

        messageContainer.classList.add('chat-message');
        metaContainer.classList.add('chat-metadata');
        metaNameContainer.classList.add('chat-metadata-name');
        metaTimeContainer.classList.add('chat-metadata-time');
        textContainer.classList.add('chat-text');

        messageContainer.append(metaContainer, textContainer);
        metaContainer.append(metaNameContainer, metaTimeContainer);

        metaNameContainer.innerHTML = name;
        metaTimeContainer.innerHTML = time;
        textContainer.innerHTML = message;

        if(name === chatUser.getUsername()){
            messageContainer.classList.add(OWN_MESSAGE_STYLE);
        }else if(name === chatUser.getServername()){
            messageContainer.classList.add(SERVER_MESSAGE_STYLE);
        }else{
            messageContainer.classList.add(OUTSIDER_MESSAGE_STYLE);
        }

        chatContainer.appendChild(messageContainer);
    }
}

function clear(){
    chatContainer.innerHTML = "";
    userlistContainer.innerHTML = "";
}

function renderUserinfo(){
    let userInfo = document.getElementById("userinfo");
    let username = chatUser.getUsername();
    if(userInfo.innerHTML !== username){
        userInfo.innerHTML = username;
    }
}

function scrollText() {
    if (autoScrollContainer.checked) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}
