'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    description: String,
    direction: String,
    phone: Number,
    admin: String,
    image: String,
    room:[{type:Schema.ObjectId, ref:'room'}],
    reservation:[{type:Schema.ObjectId, ref:'reservation'}]
});

module.exports = mongoose.model('hotel',hotelSchema);