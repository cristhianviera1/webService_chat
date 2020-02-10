/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const socketEvents = require('./web/socket');
const routes = require('./web/routes');
const appConfig = require('./config/app-config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const Usuario = require('./models/usuario');
const Chat = require('./models/chat');

//Mongoose
mongoose.connect('mongodb://localhost/kimirina_app')
    .then(db => console.log('DB conectada'))
    .catch(err => console.log(err));


class Server {

    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    }

    appConfig() {
        new appConfig(this.app).includeConfig();
    }

    /* Including app Routes starts*/
    includeRoutes() {
        new routes(this.app).routesConfig();
        this.socket.on("connection", (userSocket) => {
            userSocket.on("send_message", async (data) => {
                var chat = JSON.parse(data);
                console.log(chat.message);
                Chat.create({
                    userIdSend: chat.userIdSend,
                    userIdReceive: chat.userIdReceive,
                    message: chat.message,
                }, function (err, chat) {
                    if (err) { return res.status(500).send("Un error al guardar el chat") }
                });
                userSocket.broadcast.emit("receive_message", data)
            });
            userSocket.on("getChats", async (data) => {
                console.log(data);
                var res = await Usuario.find({ rol: "brigadista" }, { password: false, edad: false });
                userSocket.emit("getChats_response", res)
            })
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