'use strict'
var express = require('express');
var bodyParser = require('body-parser');

//se ejecutar express http
var app = express();
//carga middelwares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//cargar ficheros rutas
var articleRouters = require('./routers/artitleRoute');

//CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//añadir prefijos rutas
app.use('/',articleRouters)

//exportar modulo
module.exports=app;

