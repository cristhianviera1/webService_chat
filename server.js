'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const routes = require('./web/routes');
const appConfig = require('./config/app-config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketEvents = require('./controllers/chatController');
//Mongoose
mongoose.connect('mongodb://localhost/kimirina_app')
    .then(() => console.log("DB conectada"))
    .catch(err => console.log(err));

class Server {
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
        new socketEvents(this.sockets).socketConfig();
    }

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
module.exports.app = app;
