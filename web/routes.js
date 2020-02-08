/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const routeHandler = require('./../handlers/route-handler');
global.__root   = __dirname + '/'; 
var webroutes = require(__root + '../controllers/routesweb');
var usuarioController = require(__root + '../controllers/usuarioController');
var novedadController = require(__root + '../controllers/novedadesController');
var productoController = require(__root + '../controllers/productosController')

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){
		this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler);

		this.app.post('/register', routeHandler.registerRouteHandler);

		this.app.post('/login', routeHandler.loginRouteHandler);

		this.app.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler);

		this.app.post('/getMessages', routeHandler.getMessagesRouteHandler);

		this.app.use('/webroutes', webroutes);

		this.app.use('/', usuarioController);

		this.app.use('/novedades', novedadController);

		this.app.use('/productos', productoController);

		this.app.get('*', routeHandler.routeNotFoundHandler);

		
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;