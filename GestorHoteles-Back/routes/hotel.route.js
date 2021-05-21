'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:userId/savedHotel',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],hotelController.savedHotel);
api.put('/:userId/updateHotel/:hotelId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],hotelController.updateHotel);
api.put('/:userId/removeHotel/:hotelId',hotelController.removeHotel);

module.exports = api;