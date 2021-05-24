'use strict'

const express = require('express');
const roomController = require('../controllers/room.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:hotelId/saveRoom/:userId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],roomController.saveRoom);
api.put('/:hotelId/upadateRoom/:roomId/:userId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],roomController.upadateRoom);
api.put('/:hotelId/removeRoom/:roomId/:userId',[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],roomController.removeRoom);
api.get('/getRoom',roomController.getRoom);

module.exports = api;