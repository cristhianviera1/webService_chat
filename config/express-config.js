/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/
const bodyParser = require('body-parser');

class ExpressConfig{
	
	constructor(app){
		// Setting .html as the default template extension
		app.set('view engine', 'html');

		//Files 
		app.use(require('express').static(require('path').join('public')));
		app.use(bodyParser.json({ limit: '10mb' }));
		app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
	}
}
module.exports = ExpressConfig;
