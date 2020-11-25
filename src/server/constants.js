const path = require("path");

exports.serverHeartBeat = 2000;
exports.appPort = 2000;
exports.serverPort = 2001;

exports.USER_NAME = Symbol("username");
exports.USER_CONNECTED = Symbol("userconnected");

exports.TYPE_CHAT_USER_MESSAGE = 0;
exports.TYPE_CHAT_USER_USERS = 1;
exports.TYPE_CHAT_USER_CHAT_HISTORY = 2;
exports.TYPE_CHAT_USER_NAME = 3;

exports.TYPE_CHAT_SERVER_MESSAGE = 0;
exports.TYPE_CHAT_SERVER_NAME_CHANGE = 1;

exports.publicFolderPath = path.join(__dirname, "/../", 'public');
exports.chatFilePath = path.join(__dirname, "chat.txt");