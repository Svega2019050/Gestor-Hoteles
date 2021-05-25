'use strict'

const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');


/*Save Hotel*/
function savedHotel(req, res){
    var userId = req.params.userId;
    var hotel = new Hotel();
    var params = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        User.findById(userId,(err,userFind)=>{
            if (err) {
                return res.status(500).send({message: 'Error General'});
            } else if(userFind){
                if (params.name && params.description && params.direction  && params.phone) {
                    Hotel.findOne({name: params.name.toLowerCase()}, (err, hotelFind)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        }else if (hotelFind) {
                            return res.send({message:'Nombre de Hotel Ya Registrado'});
                        }else{
                            hotel.name = params.name.toLowerCase();
                            hotel.description = params.description.toLowerCase();
                            hotel.direction = params.direction;
                            hotel.phone = params.phone;
                            hotel.admin = params.admin;
            
                            hotel.save((err, hotelSaved)=>{
                                if (err) {
                                    return res.status(500).send({message: ' Error General'}); 
                                } else if(hotelSaved){
                                    User.findByIdAndUpdate(userId,{$push:{hotel:hotelSaved._id}},{new:true},(err,hotelPush)=>{
                                        if (err) {
                                            return res.status(500).send({message: ' Error General'});
                                        } else if(hotelPush){
                                            return res.send({message:'Hotel Guardado Exitosamente',hotelPush});
                                        }else{
                                            return res.status(500).send({message: 'Error al agregar Hotel'});
                                        }
                                    }).populate('hotel');
                                }else{
                                    return res.status(500).send({message:'No se Guardo EL Hotel'});
                                }
                            });
                        }
                    });
                } else {
                    return res.status(401).send({message:'Porfavor Ingrese los Datos Necesarios'});
                }
            }else{
                return res.status(401).send({message:'No existe Usuario'});
            }
        })
    }
    

    
}

/*Update*/
function updateHotel(req, res){
    var update = req.body;
    var hotelId = req.params.hotelId;
    var userId = req.params.userId;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (update.name && update.description && update.direction  && update.phone) {
            Hotel.findById(hotelId,(err,hotelFind)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(hotelFind) {
                    User.findOne({_id:userId, hotel: hotelId},(err,userFind)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        } else if(userFind){
                            Hotel.findOne({name: update.name.toLowerCase()}, (err, hotelFind)=>{
                                if (err) {
                                    return res.status(500).send({message: ' Error General'});
                                }else if (hotelFind) {
                                    if (hotelFind._id == hotelId){
                                        Hotel.findByIdAndUpdate(hotelId, update,{new:true},(err, hotelUpdate)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al actualizar'});
                                            }else if(hotelUpdate){
                                                return res.send({message: 'Hotel actualizado', hotelUpdate});
                                            }else{
                                                return res.send({message: 'No se pudo actualizar el Hotel'});
                                            }
                                        });
                                    }else{
                                        return res.send({message:'Nombre de Hotel Ya Registrado'});
                                    }  
                                }else{
                                    Hotel.findByIdAndUpdate(hotelId, update,{new:true},(err, hotelUpdate)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al actualizar'});
                                        }else if(hotelUpdate){
                                            return res.send({message: 'Hotel actualizado', hotelUpdate});
                                        }else{
                                            return res.send({message: 'No se pudo actualizar el Hotel'});
                                        }
                                    });
                                }
                            });
                            
                            
                        }else{
                            return res.status(401).send({message: 'Usuario no encontrado'});
                        }
                    })
                }else{
                    return res.status(401).send({message: 'Hotel a Actualizar no existe'});
                }
            });
        }else{
            return res.status(401).send({message:'Porvafor ingrese todo los datos necesarios'});
        }
    }

   
}

/* Eliminar */
function removeHotel (req, res){
    var hotelId = req.params.hotelId;
    var userId = req.params.userId;
    let params = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        User.findByIdAndUpdate({_id: userId, hotel: hotelId},
            {$pull:{hotel: hotelId}},{new:true}, (err, hotelPull)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(hotelPull){
                    Hotel.findOne({_id: hotelId},(err, hotelFind)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        } else if (hotelFind) {
                            Hotel.findByIdAndRemove(hotelId, (err, HotelRemoved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al eliminar'});
                                }else if(HotelRemoved){
                                    return res.send({message: 'Hotel eliminado', HotelRemoved});
                                }else{
                                    return res.status(403).send({message: 'Hotel no eliminado'});
                                }
                            });
      
                        }else {
                            return res.status(401).send({message: 'Hotel No Encontrado'});
                        }
                    });
                }else{
                    return res.status(401).send({message: 'No se pudo Eliminar'});
                }
        });
    }



}

/* Get Hotel*/
function  getHotel(req, res) {
    Hotel.find({}).exec((err,hotels)=>{
        if (err) {
            return res.status(500).send({message:'Error General'});
        } else if(hotels){
            return res.send({message:'Hoteles', hotels});
        }else{
            return res.status(404).send({message: 'No hay Hoteles'}); 
        }
    });
}

function uploadImageHotel(req, res){
    var hotelId = req.params.hotelId;
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
                Hotel.findByIdAndUpdate(hotelId, {image: fileName}, {new:true}, (err, hotelUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(hotelUpdated){
                        res.send({hotel: hotelUpdated, hotelImage:hotelUpdated.image});
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
function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/hotels/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

/* Exports*/
module.exports = {
    savedHotel,
    updateHotel,
    removeHotel,
    getHotel,
    uploadImageHotel,
    getImage
}