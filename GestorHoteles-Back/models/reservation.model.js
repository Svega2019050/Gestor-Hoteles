'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationShema = Schema ({
    number: Number, 
});

module.exports = mongoose.model('reservation',reservationShema);