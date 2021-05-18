'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');

var api = express.Router();

api.put('/:userId/savedHotel',hotelController.savedHotel);
api.put('/:userId/updateHotel/:hotelId',hotelController.updateHotel);
api.put('/:userId/removeHotel/:hotelId',hotelController.removeHotel);

module.exports = api;