const CHAT_SCREEN_DISPLAY = "grid";
const LOGING_SCREEN_DISPLAY = "block";
const NO_DISPLAY = "none";
const PORT = "2000";
const PORTREPLACE = "2001";
const HOST = window.location.host;
let WSHOST;

let scrolled;

function join() {
    let username = usernameContainer.value;
    WSHOST  = HOST.replace(PORT,PORTREPLACE);
    chatUser = new ChatUser(username, `ws://${WSHOST}/ws`);

    loginScreenContainer.style.display = NO_DISPLAY;
    chatScreenContainer.style.display = CHAT_SCREEN_DISPLAY;
}

function sendMessage() {
    let message = textfieldContainer.value;
    textfieldContainer.value = "";
    chatUser.sendMessage(message);
}

function leave() {
    chatUser.leave();
    chatUser = null;

    loginScreenContainer.style.display = LOGING_SCREEN_DISPLAY;
    chatScreenContainer.style.display = NO_DISPLAY;

    clear();
}

function setupUI(){
    loginScreenContainer.style.display = LOGING_SCREEN_DISPLAY;
    chatScreenContainer.style.display = NO_DISPLAY;
}

function setupScrollEvent(){
    scrolled = chatContainer.scrollTop;
    chatContainer.addEventListener("scroll", function(e){
        let currentScroll = chatContainer.scrollTop;

        if(scrolled > currentScroll){
            autoScrollContainer.checked = false;
        }

        scrolled = currentScroll;
    });
}