'use strict'

const express = require('express');
const reservationController = require('../controllers/reservation.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:hotelId/saveReservation/:userId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],reservationController.saveReservation);
api.put('/:hotelId/removeReservation/:reservId',reservationController.removeReservation);


module.exports = api;