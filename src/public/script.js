let chatKey = "";


function joinConversation() {
    let username = document.getElementById("username").value;
    let joinRequest = new XMLHttpRequest();
    joinRequest.open('POST', "/login", true);
    joinRequest.setRequestHeader('Content-Type', 'application/json');
    joinRequest.onload = function () { 
        
        console.log(joinRequest.responseText);
        chatKey = joinRequest.responseText;
    };

    joinRequest.onerror = function () {
        return;
    };

    joinRequest.send(JSON.stringify({
        "username": username
    }));
}