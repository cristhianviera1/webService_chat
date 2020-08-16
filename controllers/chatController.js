const User = require('../models/user');
const Chat = require('../models/chat');
const ChatList = require('../models/chatList');
let ObjectId = require('mongoose').Types.ObjectId;

class Socket {
    constructor(socket) {
        this.io = socket;
    }

    socketEvents = () => {
        let users = {};
        this.io.on("connection", function (userSocket) {
            userSocket.on("loginRoom", function (data) {
                users[data] = userSocket.id;
            });
            userSocket.on("send_message", function (data) {
                let chat = JSON.parse(data);
                let socketId = users[chat.userIdReceive];
                userSocket.to(socketId).emit("receive_message", {
                    userIdSend: chat.userIdSend,
                    userIdReceive: chat.userIdReceive,
                    message: chat.message,
                    imagen: chat.imagen
                });
                Chat.create({
                    userIdSend: chat.userIdSend,
                    userIdReceive: chat.userIdReceive,
                    message: chat.message,
                    imagen: chat.imagen
                }, function (err) {
                    if (err) {
                        return res.status(500).send("Un error al guardar el chat")
                    }
                });
                //Función para la relación de brigadistas con usuarios
                User.findById(chat.userIdReceive, function (err, res) {
                    let user = res;
                    if (user.rol === "brigadista") {
                        ChatList.find({$and: [{"userId": user._id}, {"userToChat": chat.userIdSend}]}, function (err, res) {
                            if (res.length === 1) {
                                ChatList.updateOne({
                                    _id: res[0]._id,
                                    lastMessage: chat.message
                                }, function (err, result) {
                                });
                            }
                            if (res.length === 0) {
                                console.log("not found");
                                ChatList.create({
                                    userId: chat.userIdReceive,
                                    userToChat: chat.userIdSend,
                                    lastMessage: chat.message
                                });
                            }
                            userSocket.to(chat.userIdSend).emit("updateUsers", {"error": false});
                            userSocket.to(chat.userIdReceive).emit("updateUsers", {"error": false});
                        });
                    }
                });
            });

            userSocket.on("getUserList", async (data) => {
                let userRol = await User.findById(data);
                let response
                if (userRol.rol === "usuario") {
                    response = await User.find({"rol": "brigadista"}, {"password": false});
                } else if (userRol.rol === "brigadista") {
                    let tmpResponse = await ChatList.find({"userId": userRol._id});
                    response = [];
                    for (let obj in tmpResponse) {
                        response.push(await User.findOne({_id: new ObjectId(tmpResponse[obj].userToChat)}, {"password": false}));
                    }
                }
                userSocket.emit("getChats_response", response);
            });
            userSocket.on("logout", async (data) => {
                let user = await User.findById(data["userId"]);
                for (let usr in users) {
                    userSocket.to(users[usr]).emit("updateUsers", {"error": false});
                }
                User.updateOne({_id: user._id}, {online: false}, function () {
                    console.log("se ha deslogeado");
                });
            });
            userSocket.on("login", async () => {
                for (let usr in users) {
                    userSocket.to(users[usr]).emit("updateUsers", {"error": false});
                }
            });
        });
    };

    socketConfig = () => {
        this.socketEvents();
    };
}

module.exports = Socket;