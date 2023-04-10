'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.connect('mongodb://localhost:27023/api-articulos',{useNewUrlParser:true})
        .then(()=>{
            console.log("Conexion creada!!");
            //se levanta servicio y comienza a escuchar
            app.listen(port,()=>{
                console.log("servicio corriendo en http://localhost:"+port);
            });
        });
