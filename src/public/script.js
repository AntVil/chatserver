let user;

let frame;

window.onload = function () {
    user = null;

    frame = 0;
    loop();
}

function loop() {

    if (user !== null && frame % 120 === 0) {
        var messages = user.getMessages();
        //TODO: handle messages
    }

    frame++;
    requestAnimationFrame(loop);
}


function join() {
    let username = document.getElementById("username").value;
    user = new ChatUser(username);
}

function sendMessage() {
    let message = document.getElementById("message").value;
    user.sendMessage(message);
}

function leave() {
    user.leave();
}