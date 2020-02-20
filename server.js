/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const routes = require('./web/routes');
const appConfig = require('./config/app-config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')


const Usuario = require('./models/usuario');
const Chat = require('./models/chat');
const ChatList = require('./models/chatList');
var ObjectId = require('mongoose').Types.ObjectId;

//Mongoose
mongoose.connect('mongodb://localhost/kimirina_app')
    .then(db => console.log('DB conectada'))
    .catch(err => console.log(err));


class Server {
    users = {};
    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        this.sockets = socketio(this.http);
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(express.static('public'));
        /*this.app.use(cors({origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204}));*/
    }

    appConfig() {
        new appConfig(this.app).includeConfig();
    }

    /* Including app Routes starts*/
    includeRoutes() {

        new routes(this.app).routesConfig();
        this.sockets.on("connection", (userSocket) => {
            //creación de socket para cada usuario
            console.log("someone enter here or here xd");
            userSocket.on("loginRoom", (data) => {
                if (data in this.users) {
                    console.log("Ya has abierto :v ");
                } else {
                    var nickname = data;
                    this.users[nickname] = this.sockets;
                }
                console.log("someone enter here");
            });
            //Socket para el envio de mensajes
            userSocket.on("send_message", async (data) => {
                var chat = JSON.parse(data);
                Chat.create({
                    userIdSend: chat.userIdSend,
                    userIdReceive: chat.userIdReceive,
                    message: chat.message,
                    imagen:chat.imagen
                }, function (err, chat) {
                    if (err) { return res.status(500).send("Un error al guardar el chat") }
                });
                //Función para la relación de brigadistas con usuarios
                Usuario.findById(chat.userIdReceive, function (err, res) {
                    var user = res;
                    if (user.rol == "brigadista") {
                        ChatList.find({ $and: [{ "userId": user._id }, { "userToChat": chat.userIdSend }] }, function (err, res) {
                            if (res.length == 1) {
                                ChatList.updateOne({ _id: res[0]._id, lastMessage: chat.message }, function (err, result) { });
                            }
                            if (res.length == 0) {
                                console.log("not found");
                                ChatList.create({
                                    userId: chat.userIdReceive,
                                    userToChat: chat.userIdSend,
                                    lastMessage: chat.message
                                });
                            }
                        });
                    }
                });
                if (chat.userIdReceive in this.users) {
                    console.log(chat.userIdReceive);
                    this.users[chat.userIdReceive].emit("receive_message", {
                        userIdSend: chat.userIdSend,
                        userIdReceive: chat.userIdReceive,
                        message: chat.message,
                        imagen: chat.imagen
                    });
                }
            });
            userSocket.on("getUserList", async (data) => {
                var userRol = await Usuario.findById(data);
                var response
                if (userRol.rol == "usuario") {
                    response = await Usuario.find({ "rol": "brigadista" }, { "password": false });
                } else if (userRol.rol == "brigadista") {
                    var tmpResponse = await ChatList.find({ "userId": userRol._id });
                    response = new Array;
                    for (var obj in tmpResponse) {
                        response.push(await Usuario.findOne({ _id: new ObjectId(tmpResponse[obj].userToChat) }, { "password": false }));
                    }
                }
                userSocket.emit("getChats_response", response)
            });

            //socket para desloguearse e inhabilitar usuario como activo
            userSocket.on("logout", async (data) => {
                var usuario = await Usuario.findById(data["userId"]);
                Usuario.updateOne({ _id: usuario._id }, { online: false }, function (err, res) {
                    console.log(res);
                });
                console.log(this.users);
                for (var usr in this.users) {
                    console.log(this.user[usr]);
                    this.users[usr].emit("updateOfUser", "ALV PRRO DEBE RETORNAR ALGO");
                }
                //sockets.broadcast.emit("updateOfUser", "ALV PRRO DEBE RETORNAR ALGO");
            });
        })
    }
    /* Including app Routes ends*/

    appExecute() {
        this.appConfig();
        this.includeRoutes();

        const port = process.env.PORT || 4000;
        const host = process.env.HOST || `localhost`;

        this.http.listen(port, host, () => {
            console.log(`Listening on http://${host}:${port}`);
        });
    }

}

const app = new Server();
app.appExecute();