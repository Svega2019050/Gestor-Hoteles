'use strict'

const express = require('express');
const reservationController = require('../controllers/reservation.controller');

var api = express.Router();

api.put('/:hotelId/saveReservation',reservationController.saveReservation);


module.exports = api;