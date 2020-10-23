//TODO: send refresh requests every 10sec even when window closed (-> web worker)
let user;

let frame;

window.onload = function () {
    user = null;

    frame = 0;
    loop();
}

function loop() {

    //get chat every 120 frames = 2sec
    if (user !== null && frame % 120 === 0) {
        let messages = user.getMessages();
        //TODO: handle messages
        let userList = user.getUsers();
        //TODO: handle users
    }

    frame++;
    requestAnimationFrame(loop);
}



/* FUNCTIONS CALLED BY USER (BUTTON) */
function join() {
    let username = document.getElementById("username").value;
    user = new ChatUser(username);
    //TODO: change appearance
}

function sendMessage() {
    let message = document.getElementById("message").value;
    user.sendMessage(message);
}

function leave() {
    user.leave();
    user = null;
    //TODO: change appearance
}