'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3200;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://admin:admin@gestorhoteles.ezb2r.mongodb.net/GestorHoteles?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
            console.log('Conectado a la BD');
            app.listen(port, ()=>{
                console.log('Servidor de express corriendo')
            })
    })
    .catch((err)=>{ console.log('Error al conectar a la BD', err)})