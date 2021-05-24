'use strict'

const hotelModel = require("../models/hotel.model");
const roomModel = require("../models/room.model");
const userModel = require("../models/user.model");

/* Save Room */
function saveRoom(req, res) {
    var hotelId = req.params.hotelId;
    var userId = req.params.userId;
    var room = new roomModel();
    var params = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (params.beds && params.price && params.numberRoom) {
            hotelModel.findById(hotelId,(err,hotelFind)=>{
                if (err) {
                    return res.status(500).send({message:'Error General'});
                } else if (hotelFind) {
                    if (params.beds && params.price && params.capacity) {
                        roomModel.findOne({numberRoom: params.numberRoom},(err,roomField)=>{
                            if (err) {
                                return res.status(500).send({message: ' Error General'});
                            } else if(roomField){
                                return res.send({message: 'Numero de Habitación Ya existe'});
                            }else{
                                room.beds = params.beds;
                                room.price = params.price;
                                room.description = params.description;
                                room.capacity = params.capacity;
                                room.numberRoom = params.numberRoom;
    
                                room.save((err, roomSaved)=>{
                                    if (err) {
                                        return res.status(500).send({message: ' Error General'});
                                    } else if (roomSaved) {
                                        hotelModel.findByIdAndUpdate(hotelId,{$push:{room:roomSaved._id}},{new: true},(err, roomPush)=>{
                                            if (err) {
                                                return res.status(500).send({message: ' Error General'});
                                            } else if(roomPush){
                                                return res.send({message:'Habitación Guardada Exitosamente',roomPush});
                                            }else{
                                                return res.status(400).send({message:'Error al Guardar Habitación'});
                                            }
                                        }).populate('room');
                                    }else{
                                        return res.status(500).send({message:'No se Guardo EL Habitación'});
                                    }
                                });
                            }
                        });
                    }else{
                        return  res.status(401).send({message:'Porfavor ingrese los datos necesarios'});
                    }
                } else{
                    return res.status(401).send({message:'No existe Hotel'});
                }
            });
        } else {
            return res.status(401).send({message:'Porvafor ingrese todo los datos necesarios'});
        }
    }

        
}

/* Update Room */
function upadateRoom(req, res) {
    var hotelId = req.params.hotelId;
    var roomId = req.params.roomId;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (update.beds && update.price && update.numberRoom) {
            roomModel.findById(roomId,(err, roomFind)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(roomFind){
                    hotelModel.findOne({_id: hotelId, room: roomId},(err, hotelFind)=>{
                        if (err) {
                            return res.status(500).send({message: 'Error General'});
                        } else if(hotelFind){
                            roomModel.findOne({numberRoom: update.numberRoom},(err, roomVery)=>{
                                if (err) {
                                    return res.status(500).send({message: 'Error General'});
                                } else if(roomVery){
                                    if (roomVery._id == roomId) {
                                        roomModel.findByIdAndUpdate(roomId, update, {new: true}, (err, roomUpdate)=>{
                                            if (err) {
                                                return res.status(500).send({message: 'Error General'});
                                            } else if(roomUpdate){
                                                return res.send({message: 'Habitación Actualizada Exitosamente',roomUpdate});
                                            }else{
                                                return res.status(401).send({message: 'No se puedo actualizar Habitación'});
                                            }
                                        });
                                    }else{
                                        return res.status(401).send({message:'Numero de Habitación ya Existe'});
                                    }
                                }else{
                                    roomModel.findByIdAndUpdate(roomId, update, {new: true}, (err, roomUpdate)=>{
                                        if (err) {
                                            return res.status(500).send({message: 'Error General'});
                                        } else if(roomUpdate){
                                            return res.send({message: 'Habitación Actualizada Exitosamente',roomUpdate});
                                        }else{
                                            return res.status(401).send({message: 'No se puedo actualizar Habitación'});
                                        }
                                    });
                                }
                            })
                        }else{
                            return res.status(401).send({message: 'Hotel No existente'})
                        }
                    });
                }else{
                    return res.status(401).send({message:'Habitación No Existe'});
                }
            });
        } else {
            return res.status(401).send({message:'Porvafor ingrese todo los datos necesarios'});
        }
    }


}

/* Remove Room */
function removeRoom(req, res) {
    var hotelId = req.params.hotelId;
    var roomId = req.params.roomId;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        hotelModel.findByIdAndUpdate({_id: hotelId, room: roomId},
            {$pull:{room: roomId}},{new:true}, (err, roomPull)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(roomPull){
                    roomModel.findOne({_id: roomId},(err, roomFind)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        } else if (roomFind) {
                            roomModel.findByIdAndRemove(roomId, (err, roomRemoved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al eliminar'});
                                }else if(roomRemoved){
                                    return res.send({message: 'Habitación eliminada', roomRemoved});
                                }else{
                                    return res.status(403).send({message: 'Habitación no eliminada'});
                                }
                            });
                        }else {
                            return res.status(401).send({message: 'Habitación No Encontrada'});
                        }
                    });
                }else{
                    return res.status(401).send({message: 'No se pudo Eliminar'});
                }
        });
    }

}

/* Get Room */
function getRoom(req, res) {

    roomModel.find({}).exec((err, roomFind)=>{
        if (err) {
            return res.status(500).send({message:'Error General'});
        } else if(roomFind){
            return res.send({message:'Habitaciones Encontradas',roomFind});
        }else{
            return res.status(401).send({message:'Habitaciones no Encontradas'})
        }
    });
    
}

/* Exports */

module.exports = {
    saveRoom,
    upadateRoom,
    removeRoom,
    getRoom
}