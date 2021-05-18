'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    description: String,
    direction: String,
    phone: Number,
    room:[{type:Schema.ObjectId, ref:'room'}]

});

module.exports = mongoose.model('hotel',hotelSchema);