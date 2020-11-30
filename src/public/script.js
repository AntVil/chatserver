let chatUser;

let loginScreenContainer;
let usernameContainer
let chatScreenContainer;

let userlistContainer;
let chatContainer;
let autoScrollContainer;
let userInfoContainer
let textfieldContainer

let frame;

window.onload = function () {
    chatUser = null;

    setupContainers();
    
    setupUI();

    frame = 0;
    loop();
}

function loop() {
    if (chatUser !== null){
        if(frame % 30 === 0) {
            let messages = chatUser.getNewMessages();
            if(messages.length !== 0){
                renderChat(messages);
            }
    
            let userList = chatUser.getUpdatedUsers();
            if(userList.length !== 0){
                renderUsers(userList);
            }
        }
        scrollText();
        renderUserinfo();
    }

    frame++;
    requestAnimationFrame(loop);
}


function setupContainers(){
    loginScreenContainer = document.getElementById("login-screen");
    usernameContainer = document.getElementById("usernameInput")
    chatScreenContainer = document.getElementById("chat-screen");

    userlistContainer = document.getElementById("userlist");
    chatContainer = document.getElementById("chat-box");
    autoScrollContainer = document.getElementById("chat-autoScroll");
    userInfoContainer = document.getElementById("userinfo");
    textfieldContainer = document.getElementById("textfield");

    setupScrollEvent();
}
