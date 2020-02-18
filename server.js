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
const cors = require('cors')


const Usuario = require('./models/usuario');
const Chat = require('./models/chat');

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
            userSocket.on("loginRoom", (data) => {
                if (data in this.users) {
                    console.log("Ya has abierto :v ");
                } else {
                    var nickname = data;
                    this.users[nickname] = this.sockets;
                }
            });
            userSocket.on("send_message", async (data) => {
                var chat = JSON.parse(data);
                Chat.create({
                    userIdSend: chat.userIdSend,
                    userIdReceive: chat.userIdReceive,
                    message: chat.message,
                }, function (err, chat) {
                    if (err) { return res.status(500).send("Un error al guardar el chat") }
                });
                if (chat.userIdReceive in this.users) {
                    console.log(chat.userIdReceive);
                    this.users[chat.userIdReceive].emit("receive_message", {
                        userIdSend: chat.userIdSend,
                        userIdReceive: chat.userIdReceive,
                        message: chat.message
                    });
                }
            });
            userSocket.on("logout", async (data) => {
                var usuario = await Usuario.findById(data["userId"]);
                Usuario.updateOne({ _id: usuario._id }, { online: false }, function (err, res) {
                    console.log(res);
                });
                if (err) {
                    res.status(500).send("Error en el servidor");
                }
                return res.status(200).send({ "id": usuario._id, "nombre": usuario.nombre, "correo": usuario.correo, "imagen": usuario.imagen, "edad": usuario.edad, "genero": usuario.genero, "rol": usuario.rol });
            });
            userSocket.on("getChats", async (data) => {
                var userRol = await Usuario.findById(data);
                var response
                if (userRol.rol == "usuario") {
                    response = await Usuario.find({ "rol": "brigadista" }, { "password": false });
                } else if (userRol.rol == "brigadista") {
                    response = await Usuario.find({ "rol": "usuario" }, { "password": false });
                }
                userSocket.emit("getChats_response", response)
                //var res = await Usuario.find({ rol: "brigadista" }, { password: false, edad: false });
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