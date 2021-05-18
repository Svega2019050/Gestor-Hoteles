'use strict'

var Hotel = require('../models/hotel.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const { isValidObjectId } = require('mongoose');

/*Save Hotel*/
function savedHotel(req, res){
    var userId = req.params.userId;
    var hotel = new Hotel();
    var params = req.body;

    User.findById(userId,(err,userFind)=>{
        if (err) {
            return res.status(500).send({message: ' Error General'});
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
                                        return res.status(500).send({message: 'Error al agregar Hotel'})
                                    }
                                }).populate('hotel');
                            }else{
                                return res.status(500).send({message:'No se Guardo EL Hotel'})
                            }
                        });
                    }
                });
            } else {
                return res.status(401).send({message:'Porfavor Ingrese los Datos Necesarios'});
            }
        }else{

        }
    })

    
}

/*Update*/
function updateHotel(req, res){
    var update = req.body;
    var hotelId = req.params.hotelId;
    var userId = req.params.userId;

    if (update.name && update.description && update.direction  && update.phone) {
        Hotel.findById(hotelId,(err,hotelFind)=>{
            if (err) {
                return res.status(500).send({message: ' Error General'});
            } else if(hotelFind) {
                User.findOne({_id:userId, hotel: hotelId},(err,userFind)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General'});
                    } else if(userFind){
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
                        return res.status(401).send({message: 'Usuario no encontrado'});
                    }
                })
            }else{
                return res.status(401).send({message: 'Hotel a Actualizar no existe'});
            }
        })
    }else{
        return res.status(401).send({message:'Porvafor ingrese todo los datos necesarios'})
    }
   
}

/* Eliminar */
function removeHotel (req, res){
    var hotelId = req.params.hotelId;
    var userId = req.params.userId;
    let params = req.body;

    User.findByIdAndUpdate({_id: userId, hotel: hotelId},
        {$pull:{hotel: hotelId}},{new:true}, (err, hotelPull)=>{
            if (err) {
                return res.status(500).send({message: ' Error General'});
            } else if(hotelPull){
                Hotel.findOne({_id: hotelId},(err, hotelFind)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General'});
                    } else if (hotelFind) {
                        bcrypt.compare(params.password, hotelPull.password, (err, checkPassword)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al verificar contraseña'});
                            }else if(checkPassword){
                                Hotel.findByIdAndRemove(hotelId, (err, HotelRemoved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al eliminar'});
                                    }else if(HotelRemoved){
                                        return res.send({message: 'Hotel eliminado', HotelRemoved});
                                    }else{
                                        return res.status(403).send({message: 'Hotel no eliminado'});
                                    }
                                });
                            }else{
                                return res.status(401).send({message: 'Contraseña incorrecta, no puedes eliminar un hotel sin contraseña'});
                            }
                        })
  
                    }else {
                        return res.status(401).send({message: 'Hotel No Encontrado'});
                    }
                });
            }else{
                return res.status(401).send({message: 'No se pudo Eliminar'});
            }
        })

}


/* Exports*/
module.exports = {
    savedHotel,
    updateHotel,
    removeHotel
}