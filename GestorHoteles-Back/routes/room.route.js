'use strict'

const express = require('express');
const roomController = require('../controllers/room.controller');

var api = express.Router();

api.put('/:hotelId/saveRoom',roomController.saveRoom);
api.put('/:hotelId/upadateRoom/:roomId',roomController.upadateRoom);
api.put('/:hotelId/removeRoom/:roomId',roomController.removeRoom);
api.get('/getRoom',roomController.getRoom);

module.exports = api;