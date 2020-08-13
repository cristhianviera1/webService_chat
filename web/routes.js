/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const routeHandler = require('./../handlers/route-handler');
global.__root   = __dirname + '/'; 
let webroutes = require(__root + '../controllers/routesweb');
let userController = require(__root + '../controllers/userController');
let newController = require(__root + '../controllers/newsController');
let productController = require(__root + '../controllers/productController');
let formController = require(__root + '../controllers/formController');

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

		this.app.use('/', userController);

		this.app.use('/news', newController);

		this.app.use('/products', productController);

		this.app.use('/form', formController);

		this.app.get('*', routeHandler.routeNotFoundHandler);

		
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;