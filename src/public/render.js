const OWN_MESSAGE_STYLE = "message-own";
const OUTSIDER_MESSAGE_STYLE = "message-other";
const SERVER_MESSAGE_STYLE = "message-server";

const emojis = {
    ":&rpar;": "🙂",
    ":D": "😃",
    ":P": "😋",
    ":&lpar;": "🙁",
    ";&lpar;": "😢",
    ";&rpar;": "😉",
    ";P": "😜",
    "xD": "😆",
    "&lt;3": "❤️",
    "lmao": "🤣",
};


function renderUsers(userList) {
    userlistContainer.innerHTML = "Online Users";
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
        let metaNameContainer = document.createElement("span");
        let metaTimeContainer = document.createElement("span");
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
        textContainer.innerHTML = replaceEmojis(message);

        if (name === chatUser.getUsername()) {
            messageContainer.classList.add(OWN_MESSAGE_STYLE);
        } else if (name === chatUser.getServername()) {
            messageContainer.classList.add(SERVER_MESSAGE_STYLE);
        } else {
            messageContainer.classList.add(OUTSIDER_MESSAGE_STYLE);
        }

        chatContainer.appendChild(messageContainer);
    }
}

function clearChat() {
    chatContainer.innerHTML = "";
    userlistContainer.innerHTML = "";
}

function renderUserinfo() {
    let username = chatUser.getUsername();
    if (userInfoContainer.innerHTML !== username) {
        userInfoContainer.innerHTML = username;
    }
}

function scrollText() {
    if (autoScrollContainer.checked) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function replaceEmojis(input) {
    Object.keys(emojis).forEach(key => {
        input = input.replace(key, emojis[key]);
    })
    return input
}