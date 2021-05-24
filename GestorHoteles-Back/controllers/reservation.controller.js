'use strict'

const hotelModel = require("../models/hotel.model");
const userModel = require("../models/user.model");
const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');

function saveReservation(req, res) {
    var userId = req.params.userId;
    var hotelId = req.params.hotelId;
    var reservId = req.params.reservId;
    var reservation = new Reservation();
    var params = req.body;
    
    if (params.number) {
        hotelModel.findOne({_id: hotelId},(err,hotelFind)=>{
            if (err) {
                return res.status(500).send({message: 'Error General al verificar Hotel'});
            } else if(hotelFind){
                Room.findOne(params.room).exec((err,roomFind)=>{
                    if (err) {
                        return res.status(500).send({message: 'Error General'});
                    }else if (roomFind.numberRoom == params.number) {
                        reservation.number = params.number;
                        
                        
                        reservation.save((err,reservationSaved)=>{
                            if (err) {
                                return res.status(500).send({message: 'Error General'});
                            }else if (reservationSaved) {
                                hotelModel.findByIdAndUpdate(hotelId,{$push:{reservation: reservationSaved._id}},
                                    {new:true},(err,reservationPush)=>{
                                        if (err) {
                                            return res.status(500).send({message: 'Error General'});
                                        }else if (reservationPush) {
                                            return res.send({message:'Reservación Exitosa',reservationPush});
                                        } else {
                                            return res.status(500).send({message: 'Error al hacer Reservación'});
                                        }
                                });    
                            } else {
                                return res.status(500).send({message: 'No se pudo hacer la reservación'});
                            }
                        });
                    } else {
                        return res.status(500).send({message: 'Habitación Inexistente'});
                    }
                })
               
                
                
            }else{
                return res.status(401).send({message: 'Hotel No Encontrado'});
            }
        });
    } else {
        return res.status(500).send({message: 'Falta de Datos para agregar Reservación'});
    }

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