'use strict'

const hotelModel = require("../models/hotel.model");
const userModel = require("../models/user.model");
const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');

function saveReservation(req, res) {
    var userId = req.params.userId;
    var hotelId = req.params.hotelId;
    var roomId = req.params.roomId;
    var reservation = new Reservation();
    var params = req.body;
    var roomReservation = Reservation();
    
    hotelModel.findById(hotelId,(err,hotelFind)=>{
        if (err) {
            return res.status(500).send({message: 'Error General'});
        } else if(hotelFind){

            Reservation.findOne({numberRoom: params.numberRoom},(err,reservationFind)=>{
                if (err) {
                    return res.status(500).send({message: ' Error General'});
                } else if(reservationFind){
                    return res.send({message:'Habitacion No Disponible'})
                }else{                    
                    roomReservation.numberRoom = params.numberRoom;

                    reservation.save((err,reservationSaved)=>{
                        if (err) {
                            return res.status(500).send({message: ' Error General'});
                        } else if(reservationSaved){
                            hotelModel.findByIdAndUpdate(hotelId,{$push:{reservation:reservationSaved._id,}},{new:true},(err,reservationPush)=>{
                                if (err) {
                                    return res.status(500).send({message: ' Error General'});
                                } else if(reservationPush){
                                   Room.findOne(reservationPush,roomId,{numberRoom:params.numberRoom}, (err,roomFind)=>{
                                        if (err) {
                                            return res.status(500).send({message:'Erro General'});
                                        } else if(roomFind){
                                            return res.send({message:'Habitacion Inexistente'})
                                        }else{
                                            return res.send({message:'Reserva Existosa',reservationPush});
                                        }
                                   });
                                }else{
                                    return res.send({message:'Error al hacer la reserva'});
                                }
                            })
                            
                        }else{
                            return res.status(401).send({message: 'No se se pudo Reservar'});
                        }
                    });
        
                }
            });
        }else{
            return res.status(401).send({message: 'Hotel no existente'});
        }
    });
}

function removeReservation(req,res) {
    var reservId = req.params.reservId;
    var hotelId = req.params.hotelId;

    hotelModel.findByIdAndUpdate({_id: hotelId, reservation: reservId},
        {$pull:{reservation: reservId}},{new:true}, (err, reservationPull)=>{
            if (err) {
                return res.status(500).send({message: ' Error General'});
            } else if(reservationPull){
                Reservation.findOne({_id: reservId},(err, reservationFind)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General'});
                    } else if (reservationFind) {
                        Reservation.findByIdAndRemove(reservId, (err, reservationRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(reservationRemoved){
                                return res.send({message: 'Reserva Cancelada', reservationRemoved});
                            }else{
                                return res.status(403).send({message: 'Reserva no se pudo cancelar'});
                            }
                        });
                    }else {
                        return res.status(401).send({message: 'Reservación No Encontrada'});
                    }
                });
            }else{
                return res.status(401).send({message: 'No se pudo Cancelar'});
            }
    });
}


  
module.exports = {
    saveReservation,
    removeReservation
}