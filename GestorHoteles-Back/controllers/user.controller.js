'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');

/* Login*/ 
function login(req, res){
    var params = req.body;
    
    if (params.username && params.password) {         
        User.findOne({username: params.username.toLowerCase()},(err,userFind)=>{
            if (err) {
                return res.status(500).send({message: ' Error General'});
            } else if(userFind) {
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General'});
                    } else if (checkPassword){
                        return res.send({message: 'Usuario Logeado Correctamente'});
                    }else{
                        return res.status(401).send({message:'Contraseña Incorrecta'});
                    }
                });
            }else{
                return res.status(401).send({message: ' Usuario No Encontrado'})
            }
        });        
    }else{
        return status(401).send({message: 'Porfavor Ingrese los datos Obligatorios'})
    }
}

/*Save User*/
function saveUser (req, res){
    var params = req.body;
    var user = new User();

    if (params.name && params.username && params.email && params.password) {
        User.findOne({username: params.username},(err, userFind)=>{
            if (err) {
                return res.status(500).send({message: ' Error General'});
            } else if (userFind) {
                return res.send({message: 'Nombre de Usuario ya en Uso'})
            } else {
                bcrypt.hash(params.password, null , null, (err, passwordHash)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General'});
                    } else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.phone = params.phone;
                        user.role = 'ROLE_USER';
                        user.username = params.username.toLowerCase();
                        user.email = params.email.toLowerCase();

                        user.save((err, userSaved)=>{
                            if (err) {
                                return res.status(500).send({message: ' Error General'});
                            } else if(userSaved){
                                return res.send({message:'Usuario Guardado Exitosamente', userSaved});
                            }else{
                                return res.status(500).send({message: 'No se Guardo El Usuario'});
                            }
                        })
                    }else{
                        return res.status(401).send({message: 'Contraseña no encriptada'});
                    }
                })
            }               
            
        })
    } else {
        return res.status(401).send({message: 'Porfavor Ingrese los valores necesarios'})
    }
}


function search(req, res){
    var params = req.body;

    if (params.search) {
        User.find({$or:[{lastName:params.search}]},(err,resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(resultSearch){
                return res.send({message: 'Coincidencias encontradas: ', resultSearch});
            }else{
                return res.status(403).send({message: 'Búsqueda sin coincidencias'});
            }
        });
    } else {
        return res.status(403).send({message: 'Ingrese datos en el campo de búsqueda'});
    }

   
}

function getUsers(req, res){

    User.find({}).populate('hotel').exec((err, users)=>{
            if(err){
                    return res.status(500).send({message: 'Error general en el servidor'})
            }else if(users){
                    return res.send({message: 'Usuarios: ', users})
            }else{
                    return res.status(404).send({message: 'No hay registros'})
            }
        })
}
/*Exports*/
module.exports = {
    login,
    saveUser,
    search,
    getUsers
}