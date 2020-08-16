/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';
global.__root = __dirname + '/';
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

		this.app.use('/', userController);

		this.app.use('/news', newController);

		this.app.use('/products', productController);

		this.app.use('/form', formController);

		
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;