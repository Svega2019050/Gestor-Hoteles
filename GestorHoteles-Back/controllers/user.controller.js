'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');

/* UploadImage */
function uploadImage(req, res){
    var userId = req.params.userId;
    var update = req.body;
    var fileName;

    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extension = fileName.split('\.');
        var fileExt = extension[1];
        if( fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg' ||
            fileExt == 'gif'){
                User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(userUpdated){
                        res.send({user: userUpdated, userImage:userUpdated.image});
                    }else{
                        res.status(400).send({message: 'No se ha podido actualizar'});
                    }
                })
            }else{
                fs.unlink(filePath, (err)=>{
                    if(err){
                        res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                    }else{
                        res.send({message: 'Extensión no válida'})
                    }
                })
            }
    }else{
        res.status(400).send({message: 'No has enviado imagen a subir'})
    }
    
}

/* view image */
function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}
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
        User.findOne({username: params.username.toLowerCase()},(err, userFind)=>{
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

/* Update User */ 
function updateUser(req, res){
    var userId = req.params.userId;
    var update = req.body;

    if (update.password || update.role) {
        return res.status(401).send({message:'No se puede actualizar la contraseña ni el rol'});
    } else {
        if (update.username) {
            User.findOne({username: update.username.toLowerCase()},(err, userFind)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(userFind){
                    User.username = update.username.toLowerCase();
                    if (userFind._id == userId) {
                        User.findByIdAndUpdate(userId, update,{username:update.username},{new:true},(err, userUpdate)=>{
                            if (err) {
                                return res.status(500).send({message: ' Error General'});
                            } else if(userUpdate){
                                return res.send({message:'Usuario Actualizado Correctamente',userUpdate});
                            }else{
                                return res.status(401).send({message: 'No se pudo actualizar el usuario'});
                            }
                        });
                    } else {
                        return res.status(401).send({message:'Nombre de Usuario ya esta en Uso'});
                    }
                }else{
                    User.findByIdAndUpdate(userId, update,{new:true},(err, userUpdate)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        } else if(userUpdate){
                            return res.send({message:'Usuario Actualizado Correctamente',userUpdate});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el usuario'});
                        }
                    });
                }
            })
        } else {
            return res.status(401).send({message: ' Nececita los datos necesarios para actualizar el Usuario'});
        }
    }

}

/* Remove User */
function removeUser(req, res){
    let userId = req.params.userId;
    let params = req.body;
   
    User.findOne({_id: userId}, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al eliminar'});
        }else if(userFind){
            bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al verificar contraseña'});
                }else if(checkPassword){
                    User.findByIdAndRemove(userId, (err, userRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar'});
                        }else if(userRemoved){
                            return res.send({message: 'Usuario eliminado', userRemoved});
                        }else{
                            return res.status(403).send({message: 'Usuario no eliminado'});
                        }
                    })
                }else{
                    return res.status(401).send({message: 'Contraseña incorrecta, no puedes eliminar tu cuenta sin tu contraseña'});
                }
            })
        }else{
            return res.status(403).send({message: 'Usuario no Encontrado'});
        } 
    })
    
}

/* save Admin user */
function saveUserByAdmin(req, res) {
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.email && params.password && params.role){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
            }else if(userFind){
                return res.send({message: 'Nombre de usuario ya en uso'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la encriptación'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.role = params.role;
                        user.username = params.username.toLowerCase();
                        user.email = params.email.toLowerCase();

                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'});
                            }else if(userSaved){
                                return res.send({message: 'Usuario guardado', userSaved});
                            }else{
                                return res.status(500).send({message: 'No se guardó el usuario'});
                            }
                        })
                    }else{
                        return res.status(401).send({message: 'Contraseña no encriptada'});
                    }
                })
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
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
    updateUser,
    removeUser,
    search,
    getUsers,
    saveUserByAdmin,
    uploadImage,
    getImage
    
}