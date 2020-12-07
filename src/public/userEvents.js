const CHAT_SCREEN_DISPLAY = "grid";
const LOGING_SCREEN_DISPLAY = "block";
const NO_DISPLAY = "none";

const WSPORT = "2001";
const WSHOST = window.location.host.split(":")[0] + ":" + WSPORT;

let scrolled;


function setupUI() {
    loginScreenContainer.style.display = LOGING_SCREEN_DISPLAY;
    chatScreenContainer.style.display = NO_DISPLAY;
}

function setupScrollEvent() {
    scrolled = chatContainer.scrollTop;
    chatContainer.addEventListener("scroll", function (e) {
        let currentScroll = chatContainer.scrollTop;
        if (scrolled > currentScroll) {
            autoScrollContainer.checked = false;
        }
        scrolled = currentScroll;
    });
}

function join() {
    let username = usernameContainer.value;
    chatUser = new ChatUser(username, `ws://${WSHOST}`);

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

    clearChat();
}
