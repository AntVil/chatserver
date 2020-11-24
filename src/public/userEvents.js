const CHAT_SCREEN_DISPLAY = "grid";
const LOGING_SCREEN_DISPLAY = "block";
const NO_DISPLAY = "none";

let scrolled;

function join() {
    let username = document.getElementById("usernameInput").value;
    chatUser = new ChatUser(username, "ws://localhost:2001/");

    loginScreenContainer.style.display = NO_DISPLAY;
    chatScreenContainer.style.display = CHAT_SCREEN_DISPLAY;
}

function sendMessage() {
    let textfield = document.getElementById("textfield");
    let message = textfield.value;
    textfield.value = "";
    chatUser.sendMessage(message);
}

function leave() {
    chatUser.leave();
    chatUser = null;

    loginScreenContainer.style.display = LOGING_SCREEN_DISPLAY;
    chatScreenContainer.style.display = NO_DISPLAY;
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