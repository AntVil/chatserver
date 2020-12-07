const path = require("path");


exports.WEBPAGE_PORT = 2000;
exports.WEBSOCKET_PORT = 2001;
exports.HOST_NAME = "0.0.0.0";

exports.SERVER_NAME = "<i>server</i>";

exports.USER_NAME_SYMBOL = Symbol("username");

exports.TYPE_CHAT_USER_MESSAGE = 0;
exports.TYPE_CHAT_USER_USERS = 1;
exports.TYPE_CHAT_USER_CHAT_HISTORY = 2;
exports.TYPE_CHAT_USER_NAME = 3;

exports.TYPE_CHAT_SERVER_MESSAGE = 0;
exports.TYPE_CHAT_SERVER_NAME_CHANGE = 1;

exports.PUBLIC_FOLDER_PATH = path.join(__dirname, "/../", 'public');
exports.CHAT_FILE_PATH = path.join(__dirname, "chat.txt");
