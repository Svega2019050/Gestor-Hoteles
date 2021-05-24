'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
    beds: Number,
    price: String,
    description: String,
    capacity: Number,
    numberRoom: Number
});

module.exports = mongoose.model('room', roomSchema);