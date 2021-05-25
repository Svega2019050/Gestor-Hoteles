'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/hotels'})

var api = express.Router();

api.put('/:userId/savedHotel',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],hotelController.savedHotel);
api.put('/:userId/updateHotel/:hotelId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],hotelController.updateHotel);
api.put('/:userId/removeHotel/:hotelId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],hotelController.removeHotel);
api.put('/:hotelId/uploadImageHotel',[mdAuth.ensureAuth,upload],hotelController.uploadImageHotel);  

api.get('/getHotel',hotelController.getHotel);
api.get('/getImage/:fileName', [upload], hotelController.getImage); 

module.exports = api;